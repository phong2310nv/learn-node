import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchBlog } from "../../actions";

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  render() {
    if (!this.props.blog) {
      return "";
    }

    const { title, content, imageUrl } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        {!!imageUrl && <img width={200} src={imageUrl} alt="blog" />}
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
