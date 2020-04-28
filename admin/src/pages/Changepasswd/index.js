import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
  const {
    form,
    form: { getFieldDecorator },
    handleSubmit,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit(fieldsValue);
    });
  };
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  return (
    <Form className={styles.form}>
      <FormItem label="旧密码" {...formLayout}>
        {getFieldDecorator('oldpassword', {
          rules: [{ required: true, message: '请输入旧密码' }],
        })(<Input.Password placeholder="请输入旧密码" />)}
      </FormItem>
      <FormItem label="新密码" {...formLayout}>
        {getFieldDecorator('newpassword', {
          rules: [{ required: true, message: '请输入新密码' }],
        })(<Input.Password placeholder="请输入请输入新密码" />)}
      </FormItem>
      <FormItem label="确认密码" {...formLayout}>
        {getFieldDecorator('repassword', {
          rules: [{ required: true, message: '请输入确认密码' }],
        })(<Input.Password placeholder="请输入请输入确认密码" />)}
      </FormItem>
      <Button type="primary" size="large" className={styles.submitBtn} onClick={okHandle}>
        确认修改
      </Button>
    </Form>
  );
});
@connect(({ changepasswd, loading }) => ({
  changepasswd,
  loading: loading.models.changepasswd,
}))
class Index extends PureComponent {
  handleSubmit = v => {
    const { dispatch } = this.props;
    console.log('handleSubmit -> dispatch', dispatch);
    dispatch({
      type: 'changepasswd/changepasswd',
      payload: {
        ...v,
        username: localStorage.getItem('userName'),
      },
    });
  };
  render() {
    return <CreateForm handleSubmit={this.handleSubmit} />;
  }
}
export default Index;
