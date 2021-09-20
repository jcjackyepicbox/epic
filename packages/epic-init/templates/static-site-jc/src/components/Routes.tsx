import { Route, Switch } from "react-router-dom";
import routes from "../routes/app.route";

function Routes() {
  return (
    <Switch>
      {routes.map((val, idx) => {
        return <Route key={idx} {...val} />;
      })}
    </Switch>
  );
}

export default Routes;
