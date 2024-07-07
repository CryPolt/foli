import { Button, Menu, PageHeader, Space, Dropdown, Modal, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import PageWrapper from '../layout/PageWrapper';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import HTTP from '../../../common/helpers/HTTP';
import Routes from '../../../common/helpers/Routes';
import Utils from '../../../common/helpers/Utils';
import Education from './Education';

const { confirm } = Modal;

const EducationList = () => {
    const [loading, setLoading] = useState(false);
    const actionRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    const columns = [
        {
            title: 'Учебное заведение',
            dataIndex: 'institution',
            search: true,
            sorter: true,
            width: 170,
            ellipsis:true
        },
        {
            title: 'Период',
            dataIndex: 'period',
            sorter: true,
            search: true,
            width: 130,
            ellipsis:true
        },
        {
            title: 'Степень',
            dataIndex: 'degree',
            sorter: true,
            search: true,
            width: 170,
            ellipsis:true
        },
        {
            title: 'Средний балл',
            dataIndex: 'cgpa',
            sorter: true,
            search: true,
            width: 130,
            ellipsis:true
        },
        {
            title: 'Факультет',
            dataIndex: 'department',
            sorter: true,
            search: true,
            width: 170,
            ellipsis:true
        },
        {
            title: 'Дипломная работа',
            dataIndex: 'thesis',
            sorter: true,
            search: true,
            width: 170,
            ellipsis:true
        },
        {
            title: 'Опции',
            valueType: 'option',
            align: 'center',
            width: 170,
            fixed: 'right',
            render: (text, row) => [
                <Dropdown key="0" overlay={menu(row)} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        Опции <DownOutlined />
                    </a>
                </Dropdown>,
            ],
        }
    ];

    const showConfirm = (rows) => {
        let ids = [];
        rows.forEach(row => {
            ids.push(row.id);
        });
        confirm({
            confirmLoading: loading,
            title: `Вы уверены, что хотите удалить ${ids.length == 1 ? 'этот' : 'эти'} ${ids.length == 1 ? 'элемент' : 'элементы'}?`,
            icon: <ExclamationCircleOutlined />,
            mask: true,
            onOk() {
                setLoading(true);
                HTTP.delete(Routes.api.admin.education, {
                    params: {
                        ids: ids
                    }
                })
                    .then(response => {
                        Utils.handleSuccessResponse(response, () => {
                            Utils.showTinyNotification(response.data.message, 'success');
                            actionRef.current?.reloadAndRest();
                        });
                    })
                    .catch((error) => {
                        Utils.handleException(error);
                    }).finally(() => {
                    setLoading(false);
                });
            },
        });
    }

    const menu = (row) => (
        <Menu>
            <Menu.Item
                key="0"
                onClick={() => {
                    setItemToEdit(row);
                    setModalVisible(true);
                }}
                icon={<EditOutlined />}
            >
                Редактировать
            </Menu.Item>
            <Menu.Item
                key="1"
                onClick={() => showConfirm([row])}
                icon={<DeleteOutlined />}
            >
                Удалить
            </Menu.Item>
        </Menu>
    );

    return (
        <React.Fragment>
            <PageWrapper>
                <PageHeader
                    style={{padding: 0}}
                    title="Образование"
                    subTitle={
                        <Typography.Text
                            style={{ width: '100%', color: 'grey' }}
                            ellipsis={{ tooltip: 'Ваша история образования' }}
                        >
                            Ваша история образования
                        </Typography.Text>
                    }
                    extra={[
                        <Button key="add" type="primary" onClick={() => setModalVisible(true)}>
                            Добавить новое
                        </Button>,
                    ]}
                >
                    <ProTable
                        columns={columns}
                        cardBordered={true}
                        showSorterTooltip={false}
                        scroll={{x: true}}
                        tableLayout={'fixed'}
                        pagination={{
                            showQuickJumper: true,
                            pageSize: 10
                        }}
                        rowSelection={{
                            // onChange: (_, selectedRows) => setSelectedRows(selectedRows),
                        }}
                        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
                            <Space>
                                <span>
                                    Выбрано {selectedRowKeys.length} элементов
                                    <a
                                        style={{
                                            marginLeft: 8,
                                        }}
                                        onClick={onCleanSelected}
                                    >
                                        <strong>Отменить выбор</strong>
                                    </a>
                                </span>
                            </Space>
                        )}
                        tableAlertOptionRender={({ selectedRows }) => (
                            <Space>
                                <Button type="primary" onClick={() => showConfirm(selectedRows)}>Массовое удаление</Button>
                            </Space>
                        )}
                        actionRef={actionRef}
                        request={async (params, sorter) => {
                            return HTTP.get(Routes.api.admin.education+'?page='+params.current, {
                                params: {
                                    params,
                                    sorter,
                                    columns
                                }
                            }).then(response => {
                                return Utils.handleSuccessResponse(response, () => {
                                    return response.data.payload
                                })
                            })
                                .catch(error => {
                                    Utils.handleException(error);
                                })
                        }}
                        dateFormatter="string"
                        search={false}
                        rowKey="id"
                        options={{
                            search: true,
                        }}
                    />
                </PageHeader>
            </PageWrapper>
            {
                modalVisible && (
                    <Education
                        title={itemToEdit ? 'Редактировать историю образования' : 'Добавить историю образования'}
                        itemToEdit={itemToEdit}
                        visible={modalVisible}
                        handleCancel={
                            () => {
                                setItemToEdit(null);
                                setModalVisible(false);
                            }
                        }
                        submitCallback={
                            () => {
                                setItemToEdit(null);
                                actionRef.current?.reloadAndRest();
                                setModalVisible(false);
                            }
                        }
                    />
                )
            }
        </React.Fragment>
    )
}

export default EducationList;
