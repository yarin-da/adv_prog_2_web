# Web Anomaly Analyzer v1.0

![Screenshot](resources/images/screenshot.png)

<!-- TODO: update TOC -->
## Table of Contents
* [1. Introduction](#1-introduction)
* [2. Dependencies](#2-dependencies)
* [3. User Guide](#3-user-guide)
  * [3.1. How To Use](#31-how-to-use)
* [4. Diagrams](#4-diagrams)
* [5. Contributors](#5-contributors)
* [6. Links and Demonstration Video](#6-links-and-demonstration-video)

***

# 1. Introduction

This project consists of a server and a web client. The project allows the user to detect and observe the anomalies in their data.

## This Version includes

* Node.js Express RESTful HTTP server:
  * Exposes a simple API for clients using REST-style requests.
  * Reads and caches the client's training data and live data.
  * Analyzes the data and provides a list of anomalies.
  * Able to service multiple clients simultaneously. 
* React web client:
  * Easy-to-use UI (buttons and file dropzones).
  * Communication with the anomaly analysis server.
  * Conversion of raw json data into beautiful graphs.
  * Data table that displays the relevant data and highlights rows that contain an anomaly.

***

# 2. Dependencies

In order to increase backward compatibility:

* [Node.js 14.16.1](https://nodejs.org/en/download/) is used to run the server

***

# 3. User Guide

## 3.1. Setup

* Clone the repo
  ```bash
  git clone https://github.com/yarin-da/adv_prog_2_web.git
  ```

* Go to the `http_server` folder 

* Open the terminal and run the server
  ```bash
  node http_server.js
  ```

* The server is now up and running.
  * If the server and client are running on the same machine: you may type `localhost:9876` into your browser.
  * otherwise, changed `localhost` to your server's IP address.

## 3.2. User Guide

* Upload a training data file using the file dropzone in the bottom-left corner.

* Select your desired model in the lower list (Model List).

* Upload a flight data file (i.e. data to analyze) using the file dropzone at the top-left.

* Click on an anomaly (if there is any) in the higher list (Anomaly List).

# 4. Diagrams
<!-- TODO -->

***

# 5. Contributors

* [Belo Coral](https://github.com/coralbelo)
* [Dado Yarin](https://github.com/yarin-da)
* [Katav Adi](https://github.com/AdiKatav)
* [Solomon Yasmin](https://github.com/yasmin15)

***

# 6. Links and Demonstration Video

* [Node.js 14.16.1](https://nodejs.org/en/download/)

## Demonstration Video
<!-- TODO -->