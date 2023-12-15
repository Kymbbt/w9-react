let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwMTkyMDE0MCwianRpIjoiYTZkMTBkMWItYmVhOS00MmRlLTgwY2MtOWVkNDhmZDRmZGY2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Imt5bWJidCIsIm5iZiI6MTcwMTkyMDE0MCwiZXhwIjoxNzMzNDU2MTQwfQ.QpZSVUrLamGGJSxZLwLLcVgpBs7b_pFKLSCxDmy6ZQM"
let userId = localStorage.getItem('uuid') 


export const serverCalls = {

    getShop: async () => {
   
        const response = await fetch(`https://flask-final-homework.onrender.com/api/shop`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status 
        }

        return await response.json()

    },
    getOrder: async () => {
       
        const response = await fetch(`https://flask-final-homework.onrender.com/api/order/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status 
        }

        return await response.json()

    },
    createOrder: async (data: any) => { 
       
        const response = await fetch(`https://flask-final-homework.onrender.com/api/order/create/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify(data) 
        });

        if (!response.ok) {
            throw new Error('Failed to create data'), response.status 
        }

        return await response.json()

    },
    updateData: async (orderId: string, data: any) => { 
       
        const response = await fetch(`https://flask-final-homework.onrender.com/api/order/update/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify(data) 
        });

        if (!response.ok) {
            throw new Error('Failed to update data'), response.status 
        }

        return await response.json()

    },
    deleteOrder: async (orderId: string, data: any) => {
      
        const response = await fetch(`https://flask-final-homework.onrender.com/api/order/delete/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to delete data'), response.status 
        }

        return await response.json()

    }
}