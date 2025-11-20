import { useState, useMemo } from 'react'
import SideBar from "./components/SideBar"
import { useAuth } from './contexts/AuthContext'
import { useUser } from './hooks/useUser'
import { useTransactions } from './hooks/useTransactions'
import AddTransactionModal from './components/AddTransactionModal'
import { BarChart } from '@mui/x-charts/BarChart'

function App() {
  const { userId, isAuthenticated } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: user } = useUser(userId!, { enabled: isAuthenticated })
  const { data: transactions } = useTransactions(userId!, { enabled: isAuthenticated })

  const summary = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0 }
    const income = transactions.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
    const expenses = transactions.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
    return { income, expenses }
  }, [transactions])

  return (
    <>
      <SideBar />
      <main>
        <h2>Welcome to WizAllet</h2>
        <p>Your current status</p>

        {isAuthenticated ? (
          <div className="dashboard-content">
            <section>
              <p>Summary</p>
              <ul>
                <li>Balance: ₴{(Number(user?.initial_balance) + summary.income - summary.expenses).toFixed(2)}</li>
                <li>Income: ₴{summary.income.toFixed(2)}</li>
                <li>Expenses: ₴{summary.expenses.toFixed(2)}</li>
              </ul>

              <button onClick={() => setIsModalOpen(true)}>+ Add Transaction</button>
            </section>

            <section>
              <p>Diagram</p>
              <BarChart
                width={500}
                height={300}
                series={[
                  { label: 'Income', data: [summary.income] },
                  { label: 'Expenses', data: [summary.expenses] },
                ]}
                xAxis={[{ scaleType: 'band', data: [''] }]}
                yAxis={[{ scaleType: 'linear' }]}
              />
            </section>
          </div>
        ) : (
          <p>Please log in to see your dashboard.</p>
        )}

        {isModalOpen && (
          <AddTransactionModal onClose={() => setIsModalOpen(false)} />
        )}
      </main>
    </>
  )
}

export default App
