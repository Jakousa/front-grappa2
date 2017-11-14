import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AgreementEditModal from '../../components/agreement/AgreementEditModal';
import AgreementView from '../../components/agreement/AgreementView';
import Agreement from '../../components/agreement/Agreement';

//redux
import { connect } from "react-redux";
import { getAgreement, saveAgreement, updateAgreement } from "./agreementActions";

//TODO: REMOVE THIS
import { callApi } from "../../util/apiConnection";
const service = require("../../util/apiConnection");

export class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAgreement: false,
            originalData: {},
            editMode: false
        }
    }

    componentDidMount() {
        document.title = "Agreement Page";

        this.props.getAgreement();
    }

    parseResponseData = (data) => {
        var parsedData = data.agreement;
        //TODO: refactor this when we can distinguish between secondary and other supervisor
        for (let i = 0; i < data.persons.length; i++) {
            if (data.persons[i].personRoleId === data.agreement.responsibleSupervisorId) {
                parsedData.thesisSupervisorMain = data.persons[i].firstname + " " + data.persons[i].lastname
            } else if (parsedData.thesisSupervisorSecond === undefined) {
                parsedData.thesisSupervisorSecond = data.persons[i].firstname + " " + data.persons[i].lastname
            } else {
                parsedData.thesisSupervisorOther = data.persons[i].firstname + " " + data.persons[i].lastname
            }
        }
        return parsedData;
    }

    toggleEditModal = () => {
        var editable = !this.state.editMode;
        this.setState({ editMode: editable });
    }

    updateFormData = (data) => {
        this.setState({ formData: data });
    }

    sendForm = () => {
        this.props.updateAgreement(this.state.formData)
    }

    startNewAgreement = () => {
        this.setState({ newAgreement: !this.state.newAgreement })
    }

    handleSaveAgreement = (agreement) => {
        this.props.saveAgreement(agreement);
    }

    render() {
        if (this.state.newAgreement) {
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> Back </button>
                    <Agreement agreement={this.props.agreement} saveAgreement={this.handleSaveAgreement} />
                </div>
            );
        } else {
            //check if form data has changed
            const disableSubmit = this.state.formData === this.state.originalData;
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> New Agreement </button>
                    <AgreementEditModal showModal={this.state.editMode} closeModal={this.toggleEditModal} formData={this.props.agreement} originalData={this.state.originalData} updateFormData={this.updateFormData} />
                    <AgreementView agreementData={this.props.agreement} />
                    <div className="ui segment">
                        <button className="ui primary button" onClick={this.toggleEditModal}>Edit agreement</button>
                        <button className="ui primary button" type="submit" disabled={disableSubmit} onClick={this.sendForm}>Save Agreement</button>
                        <br />
                        <br />
                        <p><Link to="/">Go back to HomePage</Link></p>
                    </div>
                </div>
            );
        }
    }
}

const mapDispatchToProps = (dispatch) => ({
    getAgreement(data) {
        dispatch(getAgreement(data));
    },
    saveAgreement(data) {
        dispatch(saveAgreement(data));
    },
    updateAgreement(data) {
        dispatch(updateAgreement(data));
    },
});

const mapStateToProps = (state) => {
    return {
        agreement: state.agreement
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
