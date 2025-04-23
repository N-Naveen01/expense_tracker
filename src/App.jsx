import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [name,setname] = useState('')
  const [datetime,setdatetime] = useState('')
  const [description,setdescription] = useState('')
  const [transactions , settransactions] = useState('')

  useEffect( () =>{
    getTransaction().then(settransactions)
  },[])

  async function getTransaction(){

    const url = import.meta.env.VITE_API_URL+'/transactions';

    const response = await fetch(url)
    return await response.json()
    
  }

  function addNewTranscation(ev){

    ev.preventDefault()
    const url = import.meta.env.VITE_API_URL+'/transaction';

    const price = name.split(' ')[0]
    
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        price,
        name:name.substring(price.length+1), 
        description,
        datetime })
    })
    .then(res => res.json())  
    .then(data => {
      console.log('result', data); 
      setname('');
      setdatetime('');
      setdescription('');
       
    })
    .catch(err => {
      console.error('Error:', err);
    });
  } 

  let balance = 0;
  for(const transaction of transactions){
    balance  += transaction.price
  }

  return (
    <>
      <main className="container my-5">
        <h1 className="text-center mb-4">${balance}</h1>

        <form className="p-4 mb-4 shadow-sm card" onSubmit={addNewTranscation} >
        <div className="basic row g-3">
            <div className="col-12 d-flex gap-3">
              <input type="text" value={name} onChange={ev => setname(ev.target.value)} className="form-control" placeholder="Amount & Purpose (e.g., +500 Salary, -100 Groceries)" />
              <input type="datetime-local" value={datetime} onChange={ev => setdatetime(ev.target.value)} className="form-control" />
            </div>
          </div>

          <div className="description mt-3">
            <input type="text" className="form-control" value={description} onChange={ev => setdescription(ev.target.value)} placeholder="Description" />
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary mt-4">Add New Transaction</button>
          </div>
        </form>
        {/* {transactions.length} */}

        {/* transactions */}
        <div className="transactions list-group">
          {transactions.length > 0 && transactions.map(transaction =>(
            <div className="transcation list-group-item d-flex justify-content-between align-items-center">
            <div className="left">
              <div className="name fw-bold">{transaction.name}</div>
              <div className="description text-muted small">{transaction.description}</div>
            </div>
            <div className="right text-end">
              <div className={`price fw-bold ${transaction.price < 0 ? 'text-danger' : 'text-success'}`}>{transaction.price}</div>
              <div className="datetime text-muted small">{transaction.datetime?.replace('T', ' ').replace('.000Z', '')}</div>
            </div>
          </div>
          ))}
          

        </div>
      </main>
    </>
  )
}

export default App
