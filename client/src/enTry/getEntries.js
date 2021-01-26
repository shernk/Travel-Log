import { useState } from "react";
import { listLogEntries } from "../API";

const GetEntries = async () => {
  const [logEntry, setLogEntries] = useState([]);

  const logEntries = await listLogEntries();
  console.log(logEntries);

  return setLogEntries(logEntries);
};

export default GetEntries;
