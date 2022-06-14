 export default function handleResponse(response) {
     return response.json().then(json => {
         if (!response.ok) {
             const error = (json && json.status === 'error')
             if (error) {
                 return Promise.reject(json)
             }
         }
         return json;
     })
 }