import { reactive, ref } from 'vue';
import {updateUserStatus} from '../api/user';
import { ElMessage } from 'element-plus';

//表格
export function useInitTable(opt={}) {
    const tableData = ref([]);
    const pageNumber = ref(1);
    const total = ref(0);
    const pageSize = ref(10);

    const getDataList = async (status = null) => {
        try {
            const res = await opt.getList(pageNumber.value, pageSize.value,status);
            console.log(res)
            tableData.value = res.data.data.rows;
            total.value = res.data.data.total;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };


    const handleSizeChange = (newPageSize) => {
        pageSize.value = newPageSize;
        pageNumber.value = 1;
        getDataList();
    };

    const handleCurrentChange = (newPageNumber) => {
        pageNumber.value = newPageNumber;
        getDataList();
    };

    const changeStatus = async (value) => {
        try {
            console.log("value: ", value.userId)

            await updateUserStatus(value.userId, value.status);
            ElMessage({
                message: '狀態更新成功',
                type: 'success',
            });
            // 更新成功後重新獲取數據
            await getDataList();
        } catch (error) {
            console.error('Failed to update status:', error);
            ElMessage({
                message: '狀態更新失敗',
                type: 'error',
            });
        }
    };



    return {
        tableData,
        pageNumber,
        total,
        pageSize,
        getDataList,
        handleSizeChange,
        handleCurrentChange,
        changeStatus
    };
}

//抽屜新增、修改、刪除
export function useInitForm(opt={}) {

    const drawer = ref(false);
    const drawerAdd = ref(false);
    const drawerEdit = ref(false);
    const formRef = ref(null);
    const form = reactive({});
    const editId = ref(0)
    

    const handleEdit = async (id,row) => {
            editId.value = id
            console.log("handleEdit 的參數 row : ",row)
            console.log("handleEdit 的參數 id：",id)
            for(const key in row){
                form[key] = row[key]
                
            }
            console.log("handleEdit 給 form raective 賦值 : " , form)
            drawerEdit.value = true;
    };

    const handleSubmit = async (actionType, getDataList) => {
        
        try {
            let resultMessage = '';
    
            // 使用 formRef.value.validate 進行表單驗證
            formRef.value.validate(async (valid) => {
                if (valid) {
                    // 表單驗證通過，執行相應操作
                    switch (actionType) {
                        case 'edit':
                            console.log("haneldeSubmit 取 form : " , form)
                            console.log("haneldeSubmit 取 editId : " , editId)
                            //TODO 如何把數據包裝送到後端
                            await opt.edit(editId.value, form);
                            //permissionStore.setUserName(form.username);
                            resultMessage = '更新成功';
                            drawerEdit.value = false;
                            
                            break;
                        case 'add':
                            await opt.add(form);
                            resultMessage = '新增成功.';
                            drawerAdd.value = false;
                            break;
                        default:
                            throw new Error('Invalid action type.');
                    }
    
                    ElMessage({
                        message: resultMessage,
                        type: 'success',
                    });
    
                    // 成功後調用 getDataList 函數
                    await getDataList();
                } else {
                    // 表單驗證失敗，顯示錯誤提示
                    ElMessage({
                        message: '表單驗證失敗',
                        type: 'error',
                    });
                }
            });
        } catch (error) {
            console.error(`${actionType} failed`, error);
            ElMessage({
                message: `${actionType} failed`,
                type: 'error',
            });
        }
    };

    const handleDelete = async (id) => {
        try {

            console.log("handleDelete 接收的 id 參數 : ", id)
            await opt.delete(id);
            await opt.getDataList();
            ElMessage({
                message: '成功刪除',
                type: 'success',
            });
            
        } catch (error) {
            console.error('Delete failed', error);
            ElMessage({
                message: 'Delete failed',
                type: 'error',
            });
        }
    };

    const handleCreate = () => {
        drawerAdd.value = true;
        
        form.value = null;
        console.log("handleCreate 的 form.value: ", form)
        
        for(const key in opt.form){
            form[key] = opt.form[key]
        }

    };

    const cancelClick = () => {
        drawerAdd.value = false;
        drawerEdit.value = false;
    };



    return {
        drawer,
        drawerAdd,
        drawerEdit,
        formRef,
        form,
        editId,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleCreate,
        cancelClick
    };
}
