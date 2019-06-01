import React from 'react'
import { Input } from "@material-ui/core";
import Form from "../../components/Form/Form";
import FormField from "../../components/FormField/FormField";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import UserStore from "../../stores/UserStore";

class SignUpForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phone: ''
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const context = this.context;
        const { email, password, firstName, lastName, address, phone } = this.state;
        await context.signUp(email, password, firstName, lastName, address, phone);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { email, password, firstName, lastName, address, phone } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormField title="דואר אלקטרוני">
                    <Input
                        value={email}
                        name="email"
                        onChange={this.handleInputChange}
                        dir="ltr"
                        type="email"
                    />
                </FormField>
                <FormField title="סיסמה">
                    <Input
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.handleInputChange}
                        dir="ltr"
                    />
                </FormField>
                <FormField title="שם פרטי">
                    <Input value={firstName} name="firstName" onChange={this.handleInputChange} />
                </FormField>
                <FormField title="שם משפחה">
                    <Input value={lastName} name="lastName" onChange={this.handleInputChange} />
                </FormField>
                <FormField title="מספר טלפון">
                    <Input value={phone} name="phone" onChange={this.handleInputChange} />
                </FormField>
                <FormField title="כתובת מגורים">
                    <Input value={address} name="address" onChange={this.handleInputChange} />
                </FormField>
                <SubmitButton>הירשם</SubmitButton>
            </Form>
        );
    }
}

SignUpForm.contextType = UserStore;

export default SignUpForm;