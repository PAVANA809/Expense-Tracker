import { useState } from "react";
import NewEntryForm from "../components/NewEntryForm";
import ExpenseList from "../components/ExpenseList";

const Dashboard = () => {
  const [isNewEntry, setIsNewEntry] = useState(false);
    return (
      <div className="flex flex-col px-5 md:px-0"> 
        <button
          className={`items-center border rounded-lg self-end text-white p-3 font-bold ${
            isNewEntry
              ? "bg-red-600 hover:bg-red-500"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
          onClick={() => setIsNewEntry(!isNewEntry)}
        >
          {isNewEntry ? "Cancel" : "+ New Entry"}
        </button>

        {isNewEntry && <NewEntryForm setIsNewEntry={setIsNewEntry} />}
        <ExpenseList/>
      </div>
    );
}

export default Dashboard;