import { ExpenseFormData } from "./NewEntryForm";

interface Props  {
    expense: ExpenseFormData;
}

const ExpenseCard:React.FC<Props> = ({expense}) => {
    return(
        <div className="border border-blue-600 border-double rounded-lg p-3">
            <div className="flex justify-between">
            <p>{expense.category}</p>
            <p>{ new Date(expense.date).toLocaleString('en-GB',{day: '2-digit', month:'2-digit', year:'numeric', hour: '2-digit', minute: '2-digit', hour12: true}) }</p>
            </div>
            <p>{expense.type}</p>
            <p>{expense.amount}</p>
            <p>{expense.message}</p>
        </div>
    )
}

export default ExpenseCard;