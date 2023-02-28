import { createContext, useReducer } from "react";

// not setting up initial state here, only shape, autocomplete

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  // get expenses as an array
  setExpenses: (expenses) => {},
  updateExpense: (id, { description, amount, date }) => {},
  deleteExpense: (id) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // const id = new Date().toString() + Math.random().toString();
      // id is set in ManageExpense, comes from FB
      return [action.payload, ...state];
    case "SET":
      const invertedExpenses = action.payload.reverse();
      return invertedExpenses;
    case "UPDATE":
      const updatedExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );

      const updatedExpense = state[updatedExpenseIndex];

      // payload overrides
      const updatedItem = { ...updatedExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatedExpenseIndex] = updatedItem;
      return updatedExpenses;

    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  // state management logic

  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  // expense data defined above, props
  function addExpense(expenseData) {
    // arg will be passed as an action
    dispatch({ type: "ADD", payload: expenseData });
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState,
    setExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
