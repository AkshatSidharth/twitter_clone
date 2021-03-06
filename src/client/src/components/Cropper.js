import React, { Component } from "react";
import { Croppie } from "croppie";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import * as actions from "../actions";

class Cropper extends Component {
    constructor(props) {
        super(props);
        this.cropperRef = React.createRef();
    }

    componentDidMount() {
        const { img } = this.props;
        this.c = new Croppie(this.cropperRef.current, {
            viewport: {
                width: 220,
                height: 220,
                type: "circle",
            },
            boundary: {
                width: 295,
                height: 240,
            },
            mouseWheelZoom: false,
        });

        this.c.bind({
            url: img,
        });
    }

    handleImage = () => {
        const { uploadPhoto, auth, setProfileImage } = this.props;
        this.c
            .result({
                type: "canvas",
                format: "jpeg",
                circle: false,
                size: "original"
            })
            .then(async img => {
                const formData = new FormData();
                formData.append("file", img);
                formData.append("handle", auth.handle);
                formData.append("type", "profile");
                await uploadPhoto(formData);
                setProfileImage(img);
            });
    };

    render() {
        const { closeModal } = this.props;

        return (
            <div className="cropper--container">
                <div className="cropper--errorCloseIcon">
                    <i className="fas fa-times" onClick={() => closeModal()} />
                </div>
                <h4 className="cropper--header">Position and size your photo</h4>
                <div className="cropper--imgContainer">
                    <img alt="Profile Image" className="cropper--img" ref={this.cropperRef} />
                </div>
                <div className="cropper--buttonContainer">
                    <button
                        type="button"
                        className="button__themeColor"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="button__confirm"
                        onClick={async () => {
                            await this.handleImage();
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        );
    }
}

Cropper.propTypes = {
    img: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    auth: PropTypes.shape({}).isRequired,
    uploadPhoto: PropTypes.func.isRequired,
    setProfileImage: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(Cropper);
