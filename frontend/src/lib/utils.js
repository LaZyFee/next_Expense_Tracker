export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount)
}

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export const getMonthName = (month) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })
}
    
export const TYPE_BG = {
    income: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expense: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    saving: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}