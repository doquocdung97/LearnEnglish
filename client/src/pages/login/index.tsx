import React, { useState, useEffect } from "react";
import './style.scss'
import GraphqlHelper from "../../graphql";
import { MUTATION_LOGIN } from "../../graphql/user";
import { saveAccessToken } from "../../helpers";
import { ButtonLogin } from "../../component/Button";
import { useNavigate } from "react-router-dom";

const graphql_helpper = new GraphqlHelper()
const LoginPage = (props: any) => {
  const [identifier, setIdentifier] = useState(String())
  const [password, setPassword] = useState(String())
  const [message, setMessage] = useState(String())
  const [featData, setFeatData] = useState(false)
  const navigate = useNavigate();
  const afterSubmission = async (event: any) => {
    setFeatData(true)
    setMessage(String())
    event.preventDefault();
    const variables = {
      "identifier": identifier,
      "password": password
    }
    await graphql_helpper.query(MUTATION_LOGIN, variables).then((data:any)=>{
      const result = data?.login
      if(result){
        const payload = {
          accessToken: result.token,
        };
        saveAccessToken(payload)
        navigate("/");
        return data.login
      }
      setMessage("Account or password is incorrect.")
    }).finally(()=>{
      setFeatData(false)
    })
  }
  return (
    <>
      <section className="login">
        <div className="container">
          <div className="row content">
            <div className="col-md-6 col-lg-5">
              <div className="wrap p-4 p-md-5">
                {/* <div className="icon d-flex align-items-center justify-content-center">
                  <span className="fa fa-user-o"></span>
                </div> */}
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={afterSubmission}>
                  <div className="form-group">
                    <input type="text"
                      className="form-control rounded-left"
                      placeholder="Username/Email" required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)} />
                  </div>
                  <div className="form-group d-flex">
                    <input type="password"
                      className="form-control rounded-left"
                      placeholder="Password"
                      required value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  {/* <div className="form-group d-md-flex">
                    <div className="w-50">
                      <label className="checkbox-wrap checkbox-primary">Remember Me
                        <input type="checkbox" checked />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="w-50 text-md-right">
                      <a href="#">Forgot Password</a>
                    </div>
                  </div> */}
                  <div className="error-message form-group">
                    <label className="text-danger">{message}</label>
                  </div>
                  <div className="form-group">
                    <ButtonLogin type="submit" loading={featData} className="btn btn-primary rounded submit p-3 px-5">Login</ButtonLogin>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export default LoginPage