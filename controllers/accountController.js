let accounts = {
    "123456": { balance: 2500.00, transactions: [] },
    "654321": { balance: 1500.00, transactions: [] }
};

exports.getBalance = (req, res) => {
    const { accountId } = req.params;
    const account = accounts[accountId];

    if (!account) {
        return res.status(404).json({ error: "Account not found" });
    }

    res.json({ accountId, balance: account.balance });
};

exports.getTransactions = (req, res) => {
    const { accountId } = req.params;
    const { page = 1, size = 10 } = req.query;
    const account = accounts[accountId];

    if (!account) {
        return res.status(404).json({ error: "Account not found" });
    }

    const start = (page - 1) * size;
    const paginatedTransactions = account.transactions.slice(start, start + size);

    res.json({
        accountId,
        transactions: paginatedTransactions,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(account.transactions.length / size)
    });
};

exports.transferFunds = (req, res) => {
    const { accountId } = req.params;
    const { destinationAccountId, amount } = req.body;

    const account = accounts[accountId];
    const destinationAccount = accounts[destinationAccountId];

    if (!account || !destinationAccount) {
        return res.status(404).json({ error: "Account not found" });
    }

    if (account.balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
    }

    account.balance -= amount;
    destinationAccount.balance += amount;

    const transactionId = `tx${account.transactions.length + 1}`;
    const transaction = { transactionId, amount: -amount, date: new Date().toISOString(), type: "debit" };
    account.transactions.push(transaction);

    const destinationTransaction = { transactionId, amount, date: new Date().toISOString(), type: "credit" };
    destinationAccount.transactions.push(destinationTransaction);

    res.json({
        status: "success",
        transactionId,
        sourceAccountId: accountId,
        destinationAccountId,
        amount,
        date: new Date().toISOString()
    });
};
