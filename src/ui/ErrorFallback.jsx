function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Error ErrorFallback Something went wrong</p>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again!</button>
    </div>
  );
}

export default ErrorFallback;
