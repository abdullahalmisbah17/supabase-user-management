 "use server"
 import { cacheLife } from "next/cache";

export const getUsers = async () => {
'use cache'
cacheLife({
    revalidate: 10
})

 const response = await fetch('https://jsonplaceholder.typicode.com/users');

 if(!response.ok) {
    return [];
 }
 
 return await response.json();

}









