const Entry = require('../models/Entry');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Helper: Format currency
const formatCurrency = (amount) => `৳${amount.toFixed(2)}`;

const getPeriodLabel = (month, year) => {
    if (!month || !year) return 'All Transactions';
    return new Date(year, month - 1, 1).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });
};

// Helper: Get filtered entries query
const getFilteredEntriesQuery = (userId, queryParams) => {
    const { month, year, type, categoryId } = queryParams;
    const query = { userId };

    if (month && year) {
        query.month = parseInt(month);
        query.year = parseInt(year);
    }
    if (type) query.type = type;
    if (categoryId) query.categoryId = categoryId;

    return Entry.find(query)
        .populate('categoryId', 'name icon color')
        .sort({ date: -1 });
};

exports.exportToExcel = async (req, res) => {
    try {
        const entries = await getFilteredEntriesQuery(req.user.id, req.query);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenses & Income');

        // Define columns
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Type', key: 'type', width: 12 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Note', key: 'note', width: 40 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4ECDC4' }
        };

        // Add rows
        entries.forEach(entry => {
            worksheet.addRow({
                date: entry.date.toISOString().split('T')[0],
                type: entry.type.toUpperCase(),
                category: entry.categoryId?.name || 'Unknown',
                amount: formatCurrency(entry.amount),
                note: entry.note || ''
            });
        });

        // Add summary row
        const totals = entries.reduce((acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + e.amount;
            return acc;
        }, {});

        worksheet.addRow({}); // empty row
        worksheet.addRow({ date: 'SUMMARY', type: '', category: '', amount: '', note: '' });
        if (totals.income) worksheet.addRow({ date: 'Total Income', amount: formatCurrency(totals.income) });
        if (totals.expense) worksheet.addRow({ date: 'Total Expense', amount: formatCurrency(totals.expense) });
        if (totals.saving) worksheet.addRow({ date: 'Total Saving', amount: formatCurrency(totals.saving) });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.exportToPDF = async (req, res) => {
    try {
        const entries = await getFilteredEntriesQuery(req.user.id, req.query);
        const { month, year, type } = req.query;
        const periodLabel = getPeriodLabel(parseInt(month), parseInt(year));

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.pdf`);

        doc.pipe(res);

        // Header block
        doc.rect(40, 40, 515, 90).fill('#111827');
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(20).text('ExpenseFlow', 55, 58);
        doc.font('Helvetica').fontSize(11).text('Transaction Report', 55, 82);
        doc.fontSize(9).fillColor('#d1d5db').text(`Generated: ${new Date().toLocaleString()}`, 390, 60, { align: 'right', width: 140 });
        doc.text(`Period: ${periodLabel}`, 390, 76, { align: 'right', width: 140 });
        if (type) {
            doc.text(`Type: ${String(type).toUpperCase()}`, 390, 92, { align: 'right', width: 140 });
        }

        doc.moveDown(5);

        // Summary cards
        const totals = entries.reduce((acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + e.amount;
            return acc;
        }, {});
        const net = (totals.income || 0) - (totals.expense || 0) - (totals.saving || 0);

        const cards = [
            { label: 'Income', value: totals.income || 0, fill: '#dcfce7', text: '#166534' },
            { label: 'Expense', value: totals.expense || 0, fill: '#fee2e2', text: '#b91c1c' },
            { label: 'Saving', value: totals.saving || 0, fill: '#dbeafe', text: '#1d4ed8' },
            { label: 'Net', value: net, fill: '#ede9fe', text: '#5b21b6' },
        ];

        let cardX = 40;
        cards.forEach((card) => {
            doc.roundedRect(cardX, doc.y, 122, 62, 10).fill(card.fill);
            doc.fillColor(card.text).font('Helvetica-Bold').fontSize(9).text(card.label, cardX + 10, doc.y + 10);
            doc.fontSize(14).text(formatCurrency(card.value), cardX + 10, doc.y + 28);
            cardX += 130;
        });

        doc.moveDown(5);

        // Table headers
        const tableTop = doc.y;
        const colPositions = { date: 50, type: 120, category: 180, amount: 290, note: 370 };

        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Date', colPositions.date, tableTop);
        doc.text('Type', colPositions.type, tableTop);
        doc.text('Category', colPositions.category, tableTop);
        doc.text('Amount', colPositions.amount, tableTop);
        doc.text('Note', colPositions.note, tableTop);

        doc.moveDown();
        doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y - 5).lineTo(550, doc.y - 5).stroke();

        // Table rows
        doc.font('Helvetica').fontSize(9);
        let yPosition = doc.y;

        entries.forEach((entry, index) => {
            if (yPosition > 720) {
                doc.addPage();
                yPosition = 60;
                doc.font('Helvetica-Bold').fontSize(10);
                doc.text('Date', colPositions.date, yPosition);
                doc.text('Type', colPositions.type, yPosition);
                doc.text('Category', colPositions.category, yPosition);
                doc.text('Amount', colPositions.amount, yPosition);
                doc.text('Note', colPositions.note, yPosition);
                yPosition += 20;
            }

            doc.text(entry.date.toISOString().split('T')[0], colPositions.date, yPosition);
            doc.text(entry.type.toUpperCase(), colPositions.type, yPosition);
            doc.text(entry.categoryId?.name || 'Unknown', colPositions.category, yPosition);
            doc.text(formatCurrency(entry.amount), colPositions.amount, yPosition);
            doc.text((entry.note || '').substring(0, 30), colPositions.note, yPosition);

            yPosition += 20;
            doc.y = yPosition;
        });

        // Summary section
        doc.addPage();
        doc.fontSize(16).text('Summary', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Total Income: ${formatCurrency(totals.income || 0)}`);
        doc.text(`Total Expense: ${formatCurrency(totals.expense || 0)}`);
        doc.text(`Total Saving: ${formatCurrency(totals.saving || 0)}`);
        doc.text(`Net Balance: ${formatCurrency(net)}`);
        doc.text(`Total Entries: ${entries.length}`);

        doc.end();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
