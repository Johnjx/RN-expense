import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import ErrorOverLay from "../components/UI/ErrorOverlay";
import LoadingOverLay from "../components/UI/LoadingOverLay";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

function RecentExpenses() {
  // LOADING STATE
  const [isFetching, setIsFetching] = useState(true);

  // ERROR STATE
  const [error, setError] = useState();

  const expensesCtx = useContext(ExpensesContext);
  // const [fetchedExpenses, setFetchedExpenses] = useState([]);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);

      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses");
      }

      setIsFetching(false);
    }

    getExpenses();
  }, []);

  function errorHandler() {
    setError(null);
  }

  if (error && !isFetching) {
    return <ErrorOverLay message={error} onConfirm={errorHandler} />;
  }

  if (isFetching) {
    return <LoadingOverLay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7daysAgo = getDateMinusDays(today, 7);

    return expense.date >= date7daysAgo && expense.date <= today;
  });

  // const recentExpenses = fetchedExpenses.filter((expense) => {
  //   const today = new Date();
  //   const date7daysAgo = getDateMinusDays(today, 7);

  //   return expense.date >= date7daysAgo && expense.date <= today;
  // });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      period="Last 7 days"
      fallbackText="No expenses registered for the last 7 days"
    />
  );
}

export default RecentExpenses;
