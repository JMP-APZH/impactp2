import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [dairies, setDairies] = useState([]);

  useEffect(() => {
    handleClick4();
  }, []);

  const handleClick = () => {
    axios.get('http://localhost:5001/scrapall/scrapedairy3')
    // axios.get('https://webscrap972.onrender.com/scrapall/scrapedairy3')
      .then(response => {

        console.log('data from response from client dairy infinite:', response.data)
        setData(response.data)
      })
      .catch(error => {
        // console.log(error);
        console.log('error axios detailed', error)
      });
  };

  const handleClick2 = () => {
    axios.get('http://localhost:5001/scrapandsave/scrape-save')
    // axios.get('https://webscrap972.onrender.com/scrapall/scrapedairy3')
      .then(response => {

        console.log('data from response from client scrape & save:', response.data)
        setData2(response.data)
      })
      .catch(error => {
        // console.log(error);
        console.log('error axios detailed', error)
      });
  };

  const handleClick3 = () => {
    axios.get('http://localhost:5013/scrapandsave2')
    // axios.get('https://webscrap972.onrender.com/scrapall/scrapedairy3')
      .then(response => {

        console.log('data from response from client try & save:', response.data)
        setData2(response.data)
      })
      .catch(error => {
        // console.log(error);
        console.log('error axios detailed', error)
      });
  };

  const handleClick4 = () => {
    axios.get('http://localhost:5013/fetchdairies2')
    // axios.get('https://webscrap972.onrender.com/scrapall/scrapedairy3')
      .then(response => {

        console.log('data from response from fetchdairies:', response.data)
        setDairies(response.data)
      })
      .catch(error => {
        // console.log(error);
        console.log('error axios detailed', error)
      });
  };

  return (
         <>
          <h1 className="text-yellow-400 text-center w-screen p-1">Dairy</h1>

          <div className='flex flex-col items-center bg-white w-screen h-screen p-4'>
            <div>
              <h1 className='text-center'>Dairy prices review</h1>
              <div className='text-center bg-black text-white w-60 rounded-full m-5'>
                <button onClick={handleClick}>Scrape Dairy 3</button>
              </div>
              <div className='text-center bg-black text-white w-60 rounded-full m-5'>
                <button onClick={handleClick2}>Scrape & Save</button>
              </div>
              <div className='text-center bg-black text-white w-60 rounded-full m-5'>
                <button onClick={handleClick3}>Try & Save</button>
              </div>
              <div className='text-center bg-black text-white w-60 rounded-full m-5'>
                <button onClick={handleClick4}>Fetch</button>
              </div>
            </div>
          <div>

          <div className='grid grid-cols-2 bg-white h-auto'>
            {dairies.map((dairy, id) => (
              <div key={id} className="text-center p-4 border m-2">
              <div className='flex w-24 absolute '>
                  <img
                    className="p-4"
                    src={dairy.nutrifull}
                    width="150"
                    height="150"
                  />
                </div>

                <div className='flex gap-6 justify-center'>
                  <img
                    className=""
                    src={dairy.img}
                    alt={dairy.nom}
                    width="200"
                    height="200"
                  />
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-center font-semibold px-4'> {dairy.nom} </p>
                  <div>
                    <p className='text-center font-semibold p-2 text-red-700 border border-blue-700 mb-1 text-xs'> {dairy.prix} </p>
                    <p className='text-center font-semibold p-2 text-green-700 border border-red-700 text-xs'> {dairy.prixspecial} </p>
                    <p className='text-xs'> {dairy.prixunite} </p>
                  </div>
                </div>

                <div className='flex flex-row items-center'>
                  <p className='text-blue-600 font-bold text-xs px-3'> {dairy.quantite2} </p>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>
        </>
  )
}

export default HomePage
