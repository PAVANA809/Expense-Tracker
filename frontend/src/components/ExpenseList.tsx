import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { ExpenseFormData } from "./NewEntryForm";
import ExpenseCard from "./ExpenseCard";
import { useEffect, useState } from "react";


const ExpenseList = ()=>{
    const [page, setPage] = useState<number>(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(()=> {
        const startOfMonth = new Date();
        startOfMonth.setDate(2);
        startOfMonth.setHours(0, 0, 0, 0);
        setStartDate(startOfMonth.toISOString().split('T')[0])

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        setEndDate(endOfDay.toISOString().split('T')[0])
            
    },[])

    const queryParameters = {
        page: page.toString(),
        startDate: startDate,
        endDate: endDate
    }

    const { data: data } = useQuery(["Search", queryParameters], () => apiClient.Search(queryParameters),
    {
        onError: () => {},
    })

    return (
        <div>
            <div>
                <input type="date" name="startDate" value={startDate} onChange={(event)=> setStartDate(event.target.value)}/>
                <input type="date" name="endDate" value={endDate} onChange={(event)=> setEndDate(event.target.value)}/>
            </div>
            <div className="mt-2 flex flex-col gap-2">
            {data?.data && data.data.map((expense:ExpenseFormData)=> {
                return(
                    <ExpenseCard expense={expense} key={expense._id}/>
                )
            })}
            </div>
            <div className="flex justify-center gap-4 mt-3 font-bold ">
                <p onClick={()=> {
                    if(page > 1)
                        setPage(page - 1)
                }}>{"<"}</p>
                <p>{page}</p>
                <p onClick={()=> {
                    if(page < data.pagination.pages)
                        setPage(page + 1)
                }}>{">"}</p>
            </div>
        </div>
    )
}

export default ExpenseList;