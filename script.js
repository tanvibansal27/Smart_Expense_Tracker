const form = document.getElementById("form");
const list = document.getElementById("list");

let transactions = JSON.parse(localStorage.getItem("data")) || [];

// ADD
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const t = {
        id: Date.now(),
        text: document.getElementById("text").value,
        amount: +document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    transactions.push(t);
    save();
    render();
    form.reset();
});

// DELETE
function remove(id) {
    transactions = transactions.filter(t => t.id !== id);
    save();
    render();
}

// SAVE
function save() {
    localStorage.setItem("data", JSON.stringify(transactions));
}

// RENDER
function render() {
    list.innerHTML = "";

    let income = 0, expense = 0;

    transactions.forEach(t => {
        const li = document.createElement("li");
        li.classList.add(t.amount > 0 ? "plus" : "minus");

        li.innerHTML = `
            ${t.text} (${t.category})
            <span>₹${t.amount}</span>
            <button onclick="remove(${t.id})">x</button>
        `;

        list.appendChild(li);

        t.amount > 0 ? income += t.amount : expense += t.amount;
    });

    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = Math.abs(expense);
    document.getElementById("balance").innerText = income + expense;

    updateChart();
}

// CHART
let chart;

function updateChart() {
    const ctx = document.getElementById("chart");

    const data = {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [
                transactions.filter(t=>t.amount>0).reduce((a,b)=>a+b.amount,0),
                Math.abs(transactions.filter(t=>t.amount<0).reduce((a,b)=>a+b.amount,0))
            ]
        }]
    };

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: data
    });
}

// DARK MODE
document.getElementById("toggle").onclick = () => {
    document.body.classList.toggle("dark");
};

// EXPORT CSV
function downloadCSV() {
    let csv = "Text,Amount,Category,Date\n";
    transactions.forEach(t => {
        csv += `${t.text},${t.amount},${t.category},${t.date}\n`;
    });

    const blob = new Blob([csv]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "expenses.csv";
    a.click();
}

// INIT
render();