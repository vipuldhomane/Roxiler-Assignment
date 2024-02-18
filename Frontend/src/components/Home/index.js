import {Component} from 'react'

import './index.css'

class Home extends Component {
    state = {transactionData: [], activeMonth: '03'}

    componentDidMount(){
        this.getTransactionData()
    }

    changeMonth = (event) => {
        this.setState({activeMonth: event.target.value})
    }

    getTransactionData = async() => {
        const url = `https://s3.amazonaws.com/roxiler.com/product_transaction.json`
        const options = {
            method: 'GET',
        }

        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)

        if(response.ok === true){
            this.setState({transactionData: data})
        } else{
            console.log(data.err)
        }
    }

    render() {
        const {activeMonth, transactionData} = this.state
        console.log(transactionData)

        return (
            <div className='dashboard'>
                <h1 className="title">Transactions History</h1>

                <div className='filter-section'>
                    <div className='search-container'>
                        <input type='text' placeholder='Search Transactions' className='search-el'/>
                    </div>

                    <div className='select-container'>
                        <select name='month' id='category' value={activeMonth} className='select-el' onChange={this.changeMonth}>
                            <option value='01'>January</option>
                            <option value='02'>February</option>
                            <option value='03'>March</option>
                            <option value='04'>Apriel</option>
                            <option value='05'>May</option>
                            <option value='06'>June</option>
                            <option value='07'>July</option>
                            <option value='08'>August</option>
                            <option value='09'>September</option>
                            <option value='10'>October</option>
                            <option value='11'>November</option>
                            <option value='12'>December</option>                            
                        </select>
                    </div>
                </div>

                <table className='transaction-table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Image</th>
                            <th>Date Of Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Laptop</td>
                            <td>Macbook Pro 2019</td>
                            <td>$1500</td>
                            <td>Electronics</td>
                            <td><i className='fa fa-check'></i></td>
                            <td><img src='' alt=""/></td>
                            <td>2020-03-10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Phone</td>
                            <td>Iphone XR</td>
                            <td>$1200</td>
                            <td>Electronics</td>
                            <td><i className='fa fa-times'></i></td>
                            <td><img src='' alt=""/></td>
                            <td>2020-03-10</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Home