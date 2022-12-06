import React from 'react';
import './Error.scss';

class Error extends React.Component{
    
    constructor(props: any){
        super(props);
    }

    render() {
        return (
          <h1>404: Page Not Found</h1>
        );
    }
}

export default Error;