import React from 'react';
import test from 'ava';
import { Router, Link } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
require('ignore-styles')
import {Agreement} from '../../src/components/agreement/Agreement';
import FormCreator from '../../src/components/form/FormCreater';

const wrapper = shallow(<Agreement agreement={[]} />);
let sandbox;
let server;

const formItems = {
    input: [
        "studentName",
        "studentNumber",
        "studentAddress",
        "studentPhone",
        "studentEmail",
        "studentMajor",
        "thesisStartDate",
        "thesisCompletionEta",
        "thesisSupervisorMain",
        "thesisSupervisorSecond",
        "thesisSupervisorOther",
    ],
    textarea: [
        "thesisTitle",
        "thesisPerformancePlace",
        "thesisWorkStudentTime",
        "thesisWorkSupervisorTime",
        "thesisWorkIntermediateGoal",
        "thesisWorkMeetingAgreement",
        "thesisWorkOther",
        "studentGradeGoal"
    ]
}

const stateValueChecker = (elementType, elementName) => {
    const randomString = getRandomString();
    const input = findElement(elementType,elementName);
    input.simulate('change', { target: { name: elementName, value: randomString } });

    return (wrapper.state().form[elementName] === randomString);
}

const textareaValueChecker = (elementType, elementName) => {
    const randomString = getRandomString();
    const textArea = findElement(elementType, elementName);
    textArea.simulate('change', { target: {name: elementName, value: randomString } });
    return (wrapper.find(elementType + '[name="' + elementName + '"]').props().value === randomString);
}

const getJson = (object) => {
    return JSON.stringify(object);
}

const findElement = (elementType, elementName) => {
    return wrapper.find(elementType + '[name="' + elementName + '"]');
}



const getRandomString = () => {
    return Math.random().toString(36).substring(8);
}


test('should have ' + formItems.textarea.length + ' textarea elements', t => {
    t.is(wrapper.find('textarea').length, formItems.textarea.length);
});
test('should have ' + formItems.input.length + ' input elements', t => {
    t.is(wrapper.find('input').length, formItems.input.length);
});

test('should have a submit element', t => {
    t.is(wrapper.find('button[type="submit"]').length, 1);
});

test('should have specified ' + formItems.textarea.length + ' textarea and ' + formItems.input.length + ' input empty state elements', t => {
    for (let i = 0; i < (formItems.textarea.length); i++) {
        t.is(wrapper.state().form[formItems.textarea[i]], "");
    }
    for (let i = 0; i < (formItems.input.length); i++) {
        t.is(wrapper.state().form[formItems.input[i]], "");
    }
});

for (let i = 0; i < (formItems.textarea.length); i++) {
    test('change ' + formItems.textarea[i] + ' is filled, state changes', t => {
        t.truthy(stateValueChecker('textarea', formItems.textarea[i]));
    });
}
for (let i = 0; i < (formItems.input.length); i++) {
    test('change ' + formItems.input[i] + ' is filled, state changes', t => {
        t.truthy(stateValueChecker('input', formItems.input[i]));
    });
}

for (let i = 0; i < (formItems.textarea.length); i++) {
    test('change in ' + formItems.textarea[i] + ' changes field value', t => {
        t.truthy(textareaValueChecker('textarea', formItems.textarea[i]));
    });
}
for (let i = 0; i < (formItems.input.length); i++) {
    test('change in ' + formItems.input[i] + ' changes field value', t => {
        t.truthy(textareaValueChecker('input', formItems.input[i]));
    });
}

test('when send button is clicked, sendForm method is called', t => {
    const instance = wrapper.instance();
    const spy = sinon.stub(instance, "sendForm");
    instance.forceUpdate();

    wrapper.find('button[type="submit"]').simulate('click');
    t.is(spy.calledOnce, true);
    spy.restore();
});

test("when sendForm method is called,saveAgreement() is called with correct arguments", t => {
    const instance = wrapper.instance();
    let saveStub = sinon.stub();
    wrapper.setProps({ saveAgreement: saveStub });
    instance.forceUpdate();
    wrapper.update();

    wrapper.find('textarea[name="thesisTitle"]')
        .simulate('change', { target: { name: "thesisTitle", value: getRandomString() } });

    wrapper.instance().sendForm();

    t.is(saveStub.callCount, 1);
    t.is(saveStub.calledWith(wrapper.state().form), true);
});