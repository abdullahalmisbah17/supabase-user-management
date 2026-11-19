

// export async function GET() {
//     return Response.json({
//         status: true,
//         massage: "Data retrieved successful",
//         data: [
//             {
//                 id: 1,
//                 name: "Product one",
//                 price: 100,
//             },
//             {
//                 id: 1,
//                 name: "Product one",
//                 price: 100,
//             }
//         ]
//     })
// }

export async function GET(request: Request) {
    return Response.json({
        name: "this is my name",
        address: "cox's bazar bangladesh"
    },{
        status: 
    })
}