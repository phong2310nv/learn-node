// BlogFormReview shows users their form inputs for review
import React, { Component } from "react";
import { connect } from "react-redux";
import formFields from "./formFields";
import { withRouter } from "react-router-dom";
import * as actions from "../../actions";

class BlogFormReview extends Component {
  state = {
    file: null,
  };
  renderFields() {
    const { formValues } = this.props;

    return formFields.map(({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{formValues[name]}</div>
        </div>
      );
    });
  }

  renderButtons() {
    const { onCancel } = this.props;

    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
        >
          Back
        </button>
        <button className="green btn-flat right white-text">
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();

    const { submitBlog, history, formValues } = this.props;

    submitBlog(formValues, this.state.file, history);
  }

  render() {
    console.log(this.state.file);

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h5>Please confirm your entries</h5>
        {this.renderFields()}

        <h5>Add Image</h5>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => this.setState({ file: e.target.files[0] })}
        />

        {this.renderButtons()}
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { formValues: state.form.blogForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(BlogFormReview));
