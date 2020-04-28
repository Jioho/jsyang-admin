import React from 'react';
import 'antd/dist/antd.css';
import './index.less';
import { Upload, Icon, Modal } from 'antd';

class PicturesWall extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('fileList' in nextProps) {
      return {
        ...(nextProps.fileList || {}),
      };
    }
    return null;
  }
  constructor(props) {
    super(props);
    console.log('TCL: PicturesWall -> constructor -> props.fileList', props.fileList);
    let fileList = [];
    if (props.fileList) {
      fileList = Array.isArray(props.fileList)
        ? props.fileList
        : [{ uid: 1, name: 'one', url: props.fileList }];
    }
    console.log('​PicturesWall -> constructor -> fileList', fileList);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = info => {
    let { fileList } = info;
    this.setState({ fileList });
    if (fileList.length > 0 && fileList[0].status === 'done' && fileList[0].response) {
      console.log('​PicturesWall -> his.props.onChange', this.props.onChange);
      this.props.onChange(fileList[0].response.url);
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/server/api/source/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
