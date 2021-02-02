const url = `${process.env.REACT_APP_API_URL}/api/routes`;

export async function listLogEntries() {
  const response = await fetch(url);
  return response.json();
}

export async function createLogEntry(entry) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}

export async function deleteLogEntry(entryId) {
  const response = await fetch(url + entryId, {
    method: "DELETE",
  });
  return response.json();
}

// export async function deleteLogEntry(_id) {
//   const response = await fetch(url + _id, {
//     method: "DELETE",
//   }).then(() => {
//     fetch(url)
//       .then((response) => response.json)
//       .catch((e) => console.error(e));
//   });

//   return response.json;
// }
