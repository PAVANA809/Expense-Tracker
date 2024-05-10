import mongoose from "mongoose";

export type ExpenseType = {
  category: string,
  type: string,
  amount: number,
  date: Date,
  message: string,
}

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number },
  date: { type: Date },
  message: { type: String },
});

export type ExpensesType = {
  _id: string,
  userId: string,
  expenseList: [ExpenseType]
};

const expensesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  expenseList: [expenseSchema],
});

const Expenses = mongoose.model<ExpensesType>("Expenses", expensesSchema);
export default Expenses;
