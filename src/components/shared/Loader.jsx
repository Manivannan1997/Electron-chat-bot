import React, { Component } from 'react'
import '../../styles/loader.css'

export default class Loader extends Component {

  render() {
    return (
        <div className="flex justify-start">
            <div className="p-3 rounded-lg max-w-xs w-full">
                <div className="loader" aria-live="polite">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    )
  }
}
