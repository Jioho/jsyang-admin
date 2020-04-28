import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './form.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['code/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        localStorage.setItem('values', values);
        dispatch({
          type: 'code/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const dataSource = [
      {
        key: '1',
        keyName: 'id',
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      },
    ];

    const columns = [
      {
        title: '字段名',
        dataIndex: 'keyName',
        key: 'keyName',
      },
      {
        title: 'sequelize类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '主键',
        dataIndex: 'primaryKey',
        key: 'primaryKey',
      },
      {
        title: '自增',
        dataIndex: 'autoIncrement',
        key: 'autoIncrement',
      },
    ];
    let values = localStorage.getItem('values');
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.basic.title" />}
        content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="菜单名称">
              {getFieldDecorator('menuName', {
                rules: [
                  {
                    required: true,
                    message: '请输入菜单名称',
                  },
                ],
                initialValue: values ? values.menuName : '',
              })(<Input placeholder="填写显示在左侧菜单栏的菜单名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="包名">
              {getFieldDecorator('packageName', {
                rules: [
                  {
                    required: true,
                    message: '请输入包名',
                  },
                ],
                initialValue: values ? values.packageName : '',
              })(<Input placeholder="包名将作为生成的代码的文件名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="form.public.label" />}>
              <div>
                {getFieldDecorator('structrueType', {
                  initialValue: '2',
                })(
                  <Radio.Group>
                    <Radio value="1">图形化形式</Radio>
                    <Radio value="2">代码形式</Radio>
                  </Radio.Group>
                )}
                <Table
                  style={{
                    margin: '8px 0',
                    display: getFieldValue('structrueType') === '1' ? 'block' : 'none',
                  }}
                  dataSource={dataSource}
                  columns={columns}
                />
                <div
                  style={{
                    margin: '8px 0',
                    display: getFieldValue('structrueType') === '2' ? 'block' : 'none',
                  }}
                >
                  <FormItem {...formItemLayout} label="Model定义源代码">
                    {getFieldDecorator('structure', {
                      rules: [
                        {
                          required: true,
                          message: '请输入表结构',
                        },
                      ],
                      initialValue: values ? values.structure : '',
                    })(
                      <TextArea
                        style={{ minHeight: 200 }}
                        placeholder="`请输入sequelize定义model的源代码
                  eg: {
                    title: Sequelize.STRING,
                    description: Sequelize.TEXT,
                    deadline: Sequelize.DATE
                  }`"
                        rows={10}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="字段注释对象">
                    {getFieldDecorator('comments', {
                      rules: [
                        {
                          required: true,
                          message: '请输入表各字段对应含义对象代码',
                        },
                      ],
                      initialValue: values ? values.comments : '',
                    })(
                      <TextArea
                        style={{ minHeight: 200 }}
                        placeholder="`请输入表各字段对应含义对象代码
                  eg: {
                    id: '主键id',
                    title: '标题',
                    description: '描述',
                    deadline: '截止时间'
                  }`"
                        rows={10}
                      />
                    )}
                  </FormItem>
                </div>
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
