import React, { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

import Playground from './components/Playground'
import NavbarComp from './components/Navbar'
import { languages } from './components/Languages'

export default function App() {
  function comp(a, b) {
    if (a.name > b.name) return 1
    if (a.name < b.name) return -1
    return 0
  }
  languages.sort(comp)
  const [currentLang, setCurrentLang] = useState(languages[0])
  const [value, setValue] = useState(currentLang.sampleCode)
  const [inputData, setInputData] = useState('')
  const [outputData, setOutputData] = useState('')
  const [running, setRunning] = useState(false)

  function handleChange(v, e) {
    setValue(v)
  }

  function handleInput(inp) {
    setInputData(inp)
  }

  function handleClick(newLang, index) {
    let temp = currentLang
    setCurrentLang(newLang)
    languages[index] = temp
    while (index > 0 && languages[index - 1].name > currentLang) {
      languages[index] = languages[index - 1]
      index--
    }
    languages[index] = temp
    setValue(newLang.sampleCode)
  }

  const getOutput = async () => {
    setRunning(true)
    console.log(value)
    console.log(inputData)

    var data = JSON.stringify({
      code: value,
      language: currentLang.extension,
      input: inputData,
    })

    var config = {
      method: 'post',
      url: 'https://cors-anywhere-jaagrav.herokuapp.com/https://codexweb.netlify.app/.netlify/functions/enforceCode',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    axios(config)
      .then(function (response) {
        setRunning(false)
        setOutputData(response.data.output)
        console.log(response.data.output)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <div>
      <NavbarComp
        changeLang={handleClick}
        currentLang={currentLang}
        key={currentLang.code}
        execute={getOutput}
        loading={running}
      />
      <Playground
        currentLang={currentLang}
        key={currentLang.name}
        handleCode={handleChange}
        handleInput={handleInput}
        output={outputData}
      />
    </div>
  )
}
