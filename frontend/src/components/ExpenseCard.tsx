import { ExpenseFormData } from "./NewEntryForm";

interface Props  {
    expense: ExpenseFormData;
}

const ExpenseCard:React.FC<Props> = ({expense}) => {
    return(
        <div className="border border-blue-600 border-double rounded-lg p-3">
            <p>{expense.category}</p>
            <p>{expense.type}</p>
            <p>{expense.amount}</p>
            <p>{expense.message}</p>
        </div>
    )
}

export default ExpenseCard;