import { Connect } from "redux-zero/preact";
import actions from "./actions";

const mapToProps = ({ count, loading, payload, payload2 }) => ({ count, loading, payload, payload2 });

export default () => (
  <Connect mapToProps={mapToProps} actions={actions}>
    {({ count, loading, payload, payload2, increment, decrement, dispatch, asyncAction1, asyncAction2 }) => (
      <div>
        <h1>{count} - {loading.toString()} </h1>

        <p>asyncAction1 response:</p>
        <pre>{ JSON.stringify(payload, null, 2) }</pre>

        <p>asyncAction2 (triggered inside asyncAction1) response:</p>
        <pre>{ JSON.stringify(payload2, null, 2) }</pre>

        <div>
          <button onClick={decrement}>decrement</button>
          <button onClick={increment}>increment</button>
          <button onClick={asyncAction1}>asyncAction1</button>
        </div>
      </div>
    )}
  </Connect>
);
