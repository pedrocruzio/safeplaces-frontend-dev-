import React from "react";
import Header from '../Header/index';

const Page = () => {
  document.getElementById("defaultOpen").click();


  const openContent = (evt, content) => {
    let tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(content).style.display = "block";
    evt.currentTarget.className += " active";
  }

  return (
    <div className="container">
      <Header />
      <div className="tab">
        <button className="tablinks" onClick={(event) => openContent(event, 'configuration')} id="defaultOpen">Configuration</button>
        <button className="tablinks" onClick={(event) => openContent(event, 'account')}>Account</button>
        <button className="tablinks" onClick={(event) => openContent(event, 'publishistory')}>Publish History</button>
        <button className="tablinks" onClick={(event) => openContent(event, 'logout')}>Log Out</button>
      </div>

      <div id="configuration" className="tabcontent">
        <h3>configuration</h3>
        <p>INFO</p>
      </div>

      <div id="account" className="tabcontent">
        <h3>account</h3>
        <p>INFO</p>
      </div>

      <div id="publishistory" className="tabcontent">
        <h3>publish History</h3>
        <p>INFO</p>
      </div>
      <div id="logout" className="tabcontent">
        <h3>logout</h3>
        <p>INFO</p>
      </div>
    </div>
  )
}

export default Page;