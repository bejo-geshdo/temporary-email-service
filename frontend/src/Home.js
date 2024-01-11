import Timer from "./components/Timer";

function Home() {
  return (
    <div>
      <h1>Temporary serverless email experiment</h1>

      <p>This page let's you create a temporary email address</p>
      <p>The address and emails will be deleted after 10 minutes</p>
      <p>The address and emails can be renewed by 10 minutes up 24h</p>

      <p>Link to the API docs: </p>

      <a href={window.location.href + "docs"}>
        {window.location.href + "docs"}
      </a>

      <Timer />
    </div>
  );
}
export default Home;
