import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { ExpenseFormData } from "./NewEntryForm";
import ExpenseCard from "./ExpenseCard";


const ExpenseList = ()=>{

    const { data: data } = useQuery("Search", apiClient.Search,
    {
        onError: () => {},
    })

    return (
        <div className="mt-2 flex flex-col gap-2">
            {data?.data && data.data.map((expense:ExpenseFormData)=> {
                return(
                    <ExpenseCard expense={expense} key={expense._id}/>
                )
            })}
        </div>
    )
}

export default ExpenseList;