import React, { useEffect, useState, Component } from "react";
import './Main.css';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { loading, done } from './actions'




export default function Main() {
  let [name, setNames] = useState([]);
  let [selectName, setSelectNames] = useState("affenpinscher");

  let [count, setCounts] = useState(0);
  let [image, setImage] = useState([]);

  const isLoading = useSelector(state => state.isLoading);
  const dispatch = useDispatch();



  function Click(n) {//when breed lists get clicked

    if(selectName !== n) {
      setImage([]);
      setSelectNames(n);
      setCounts(0);
    }

  }


  useEffect(() => {//gets breeds from API
    axios
      .get("https://dog.ceo/api/breeds/list/all")
      .then(res => {
        console.log(Object.keys(res.data.message));
        setNames(Object.keys(res.data.message));
      })
      .catch(err => {
        console.log(err);
      });

  }, []);



  useEffect(() => {//gets photos from API
    axios
      .get(`https://dog.ceo/api/breed/${selectName}/images`)
      .then(res => {
        console.log(res.data.message[1]);
        dispatch(loading());
        let temp = [];
        let start = count * 4;
        for (let i = 0; i < 2; i++) {
          temp.push(res.data.message.splice(start, 4));
          start = start + 4;
        }
        image = image.concat(temp);
        setImage(image);
        dispatch(done());
      })
      .catch(err => {
        console.log(err);
      });


  }, [count, selectName]);



  function handleScroll() {

    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;


    if (scrollTop + clientHeight === scrollHeight) {//When bottom is touched
      count++;
      setCounts(count);
      console.log(count);
    }
  }

  useEffect(() => {//useEffect for scrolling
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div id="main">
      <div className="header">
        <div className="imgWrap"></div>
        <img src="./img/title.png" alt="title"></img>
        <p>By Breed</p>
      </div>
      <div className="horizontal_slider">
        <div className="slider_container">
          {name.map((n, i) => (
            <div className={selectName === n ? "itemPick" : "item"}  onClick={() => {Click(n)}}>{n}</div>
          ))}
        </div>
      </div>
      {image.map((arr, i) => (
        <div className="bodyWrap">
          {arr.map(item => (
            <div className="box" style={{ backgroundImage: `url(${item})` }}></div>
          ))}
        </div>
      ))}
      {isLoading ? <div className="loading">Loading</div> : <div></div>}
    </div>
  );

}