import { formatCurrency, formatDate } from '@/lib/utils'

const payments = [
  {
    id: 1,
    amount: 1200,
    status: 'paid',
    date: '2024-01-01',
    type: 'Rent',
    method: 'Credit Card'
  },
  {
    id: 2,
    amount: 1200,
    status: 'upcoming',
    date: '2024-02-01',
    type: 'Rent',
    method: 'Pending'
  },
  {
    id: 3,
    amount: 50,
    status: 'paid',
    date: '2023-12-15',
    type: 'Late Fee',
    method: 'Bank Transfer'
  }
]

export function PaymentHistory() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="p-4">
          <h3 className="font-semibold">Upcoming Payments</h3>
          <div className="mt-2">
            {payments
              .filter((payment) => payment.status === 'upcoming')
              .map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <h3 className="font-semibold">Past Payments</h3>
          <div className="mt-2 divide-y">
            {payments
              .filter((payment) => payment.status === 'paid')
              .map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Paid {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 