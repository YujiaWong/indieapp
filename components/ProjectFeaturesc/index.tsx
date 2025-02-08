// 'use client';
// import { useEffect, useRef } from 'react';
// import { Button, Textarea, Skeleton, Card } from '@nextui-org/react';
// import { v4 as uuidv4 } from 'uuid';
// import { HiPlus, HiOutlineTrash } from 'react-icons/hi';
// import { FaGripVertical } from 'react-icons/fa';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { useSet } from '@/utils/hooks';
// import Toast from '@/components/base/toast';
// import StartIcon from '@/components/svg/StartIcon';

// const ListSkeleton = () => {
//   const list = Array(5).fill(0);
//   return (
//     <div className='px-6 mt-12'>
//       {list.map((_, index: number) => (
//         <Card className='p-4 mb-6 border-none' shadow='sm' radius='sm' isHoverable={true} key={index}>
//            <div className='w-full flex items-top gap-3'>
//             <div>
//               <Skeleton className='flex w-8 h-8' />
//             </div>
//             <div className='w-full flex flex-col gap-2'>
//               <Skeleton className='h-4 w-2/5 rounded-lg' />
//               <Skeleton className='h-4 w-5/5 rounded-lg' />
//               <Skeleton className='h-4 w-5/5 rounded-lg' />
//             </div>
//           </div>
//         </Card>
       
//       ))}
//    </div>
//   );
// }

// export default (props: any) => {
//   const { showSkeleton, disabled, onGenerateDemo } = props;
//   const textareaRef = useRef(null);
//   const editorRef = useRef(null);

//   const [state, setState] = useSet({
//    textareaValue: '',
//    funcList: [],
//    editingId: null,
//    editingText: null,
//   });

//   const { textareaValue, funcList, editingId, editingText } = state;

//   useEffect(() => {
//     setState({ funcList: props.data || [] })
//   }, [JSON.stringify(props.data)]);

//   useEffect(() => {
//     if (!editorRef.current) {
//       return;
//     }
//     editorRef.current.focus();
//   }, [editingId])

//   const handleAddItem = () => {
//     funcList.push({ name: '', description: textareaValue, id: uuidv4() });
//     setState({
//       textareaValue: '',
//       funcList
//     })
//   };

//   // 删除项目
//   const handleDeleteItem = (id: string) => {
//     if (funcList?.length === 1) {
//       Toast.notify({
//         type: 'warning',
//         message: 'Keep at least one',
//       });
//       return;
//     }
//     setState({ funcList: funcList.filter((item: any) => item.id !== id) });
//   };

//   // 处理拖拽事件
//   const onDragEnd = (result: any) => {
//     const { destination, source } = result;
//     if (!destination) return;

//     // 如果拖拽位置没有变化，则不进行任何操作
//     if (destination.index === source.index) return;

//     const newList = Array.from(funcList);
//     const [removed] = newList.splice(source.index, 1);
//     newList.splice(destination.index, 0, removed);
//     setState({ funcList: newList });
//   };

//   // 启动编辑模式
//   const handleEditClick = (id: string, text: string) => {
//     setState({ editingId: id, editingText: text });
//   };

//   // 保存编辑内容
//   const handleSave = (id: string) => {
//     setState({ editingId: null, funcList: [...funcList.map((item: any) => (item.id === id ? { ...item, description: editingText } : item ))] });
//   };

//   return (
//     <div className='w-[600px] bg-white py-6 border-t border-gray-100 shadow-lg rounded-lg mx-auto h-full relative flex flex-col'>
//       <h2 className='absolute rounded-t-lg left-0 top-0 font-semibold mb-4 w-full py-3 pl-7 bg-gradient-to-tr from-gray-200 to-gray-0 '>Featrue List</h2>
//       {showSkeleton ? <ListSkeleton /> : (
//         <>
//           <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId='droppable-list'>
//               {(provided: any) => (
//                 <div
//                   className='space-y-3 mt-12 flex-1 h-0 overflow-auto px-6'
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   {funcList.map((item: any, index: number) => (
//                     <Draggable key={item.id} draggableId={item.id} index={index}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className='flex items-center space-x-2 bg-gray-100 p-3 rounded-lg text-[12px]'
//                         >
//                           <FaGripVertical className='cursor-pointer text-gray-500' />
//                           {/* 编辑区域：点击文本后进入编辑模式 */}
//                           {editingId === item.id ? (
//                             <Textarea
//                               ref={editorRef}
//                               type='text'
//                               value={editingText}
//                               onChange={(e) => setState({ editingText: e.target.value })}
//                               onBlur={() => handleSave(item.id)}
//                               className='flex-1 border-none bg-transparent outline-none'
//                             />
//                           ) : (
//                             <div
//                               className='flex-1 cursor-pointer'
//                               onClick={() => handleEditClick(item.id, item.description)}
//                             >
//                               {item.name ? item.name + '，' : ''}
//                             </div>
//                           )}
//                           <div className='flex items-center space-x-2'>
//                             <HiOutlineTrash
//                               onClick={() => handleDeleteItem(item.id)}
//                               className='cursor-pointer'
//                               size={16}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//           <div className='mt-10 mb-3 text-[12px] px-6'>
//             Have More thoughts? Add them below
//           </div>
//           <div className='px-6 mb-16'>
//             <Textarea
//               placeholder='Add more functions here, user enter to separate functions'
//               ref={textareaRef}
//               value={textareaValue}
//               onChange={ev => setState({ textareaValue: ev.target.value })}
//               classNames={{
//                 input: 'placeholder:text-[12px]'
//               }}
//             />
//             <Button
//               size='sm' 
//               color='primary' 
//               variant='light'
//               startContent={<HiPlus />}
//               className='mt-1 px-0'
//               onPress={handleAddItem}
//             >
//               new feature
//             </Button>
//           </div>
//           <Button 
//             color='primary' 
//             className='mt-4 absolute bottom-4 left-4 right-4 bg-black'
//             size='md'
//             onPress={() => onGenerateDemo(funcList)}
//             isDisabled={disabled}
//           >
//             <StartIcon />
//             Generate Demo
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }

'use client';
import { useEffect, useRef } from 'react';
import { Button, Textarea, Skeleton, Card } from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';
import { HiPlus, HiOutlineTrash } from 'react-icons/hi';
import { FaGripVertical } from 'react-icons/fa';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
import { useSet } from '@/utils/hooks';
import Toast from '@/components/base/toast';
import StartIcon from '@/components/svg/StartIcon';

const ListSkeleton = () => {
  const list = Array(5).fill(0);
  return (
    <div className='px-6 mt-12'>
      {list.map((_, index: number) => (
        <Card className='p-4 mb-6 border-none' shadow='sm' radius='sm' isHoverable={true} key={index}>
           <div className='w-full flex items-top gap-3'>
            <div>
              <Skeleton className='flex w-8 h-8' />
            </div>
            <div className='w-full flex flex-col gap-2'>
              <Skeleton className='h-4 w-2/5 rounded-lg' />
              <Skeleton className='h-4 w-5/5 rounded-lg' />
              <Skeleton className='h-4 w-5/5 rounded-lg' />
            </div>
          </div>
        </Card>
       
      ))}
   </div>
  );
}

const DraggableItem = ({ item, onSvae, onDelete, onEdit, editingId, editingText, setState, editorRef }: any) => {
  const { setNodeRef, listeners, transform, isDragging, transition } = useSortable({ id: item.id });
  
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className='flex items-center space-x-2 bg-gray-100 p-3 rounded-lg text-[12px]'
    >
      <FaGripVertical className='cursor-pointer text-gray-500' />
      {editingId === item.id ? (
        <Textarea
          ref={editorRef}
          value={editingText}
          onChange={(e) => setState({ editingText: e.target.value })}
          onBlur={() => onSvae(item.id)}
          className='flex-1 border-none bg-transparent outline-none'
        />
      ) : (
        <div className='flex-1 cursor-pointer' onClick={() => onEdit(item.id, item.description)}>
          {item.name ? item.name : item.description}
        </div>
      )}
      <HiOutlineTrash onClick={() => onDelete(item.id)} className='cursor-pointer' size={16} />
    </div>
  );
};

export default (props: any) => {
  const { showSkeleton, disabled, onGenerateDemo } = props;
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  const [state, setState] = useSet({
    textareaValue: '',
    funcList: [],
    editingId: null,
    editingText: null,
  });

  const { textareaValue, funcList, editingId, editingText } = state;

  useEffect(() => {
    setState({ funcList: props.data || [] });
  }, [JSON.stringify(props.data)]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.focus();
  }, [editingId])

  const handleAddItem = () => {
    const newItem = { name: '', description: textareaValue, id: uuidv4() };
    setState({
      textareaValue: '',
      funcList: [...funcList, newItem],
    });
  };

  const handleDeleteItem = (id: string) => {
    if (funcList?.length === 1) {
      Toast.notify({
        type: 'warning',
        message: 'Keep at least one',
      });
      return;
    }
    setState({ funcList: funcList.filter((item) => item.id !== id) });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      const oldIndex = funcList.findIndex((item) => item.id === active?.id);
      const newIndex = funcList.findIndex((item) => item.id === over?.id);
      const newList = arrayMove(funcList, oldIndex, newIndex);
      setState({ funcList: newList });
    }
  };

  const handleEditClick = (id: string, text: string) => {
    setState({ editingId: id, editingText: text });
  };

  const handleItemSave = (id: string) => {
    setState({
      editingId: null,
      funcList: funcList.map((item) =>
        item.id === id ? { ...item, description: editingText } : item
      ),
    });
  };

  const sensors = useSensors(useSensor(PointerSensor,{
    activationConstraint: {
      delay: 120,
      tolerance: 5,
    }
  }));

  return (
    <div className='w-[600px] bg-white py-6 border-t border-gray-100 shadow-lg rounded-lg mx-auto h-full relative flex flex-col'>
      <h2 className='absolute rounded-t-lg left-0 top-0 font-semibold mb-4 w-full py-3 pl-7 bg-gradient-to-tr from-gray-200 to-gray-0'>Feature List</h2>
      {showSkeleton ? (
        <ListSkeleton />
      ) : (
        <>
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={funcList} strategy={verticalListSortingStrategy}>
              <div className='space-y-3 mt-12 flex-1 h-0 overflow-auto px-6'>
                {funcList.map((item: any) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    editingId={editingId}
                    editingText={editingText}
                    editorRef={editorRef}
                    setState={setState}
                    onDelete={handleDeleteItem}
                    onEdit={handleEditClick}
                    onSvae={handleItemSave}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className='mt-10 mb-3 text-[12px] px-6'>Have more thoughts? Add them below</div>
          <div className='px-6 mb-16'>
            <Textarea
              placeholder='Add more functions here, user enter to separate functions'
              ref={textareaRef}
              value={textareaValue}
              onChange={ev => setState({ textareaValue: ev.target.value })}
              classNames={{
                input: 'placeholder:text-[12px]'
              }}
            />
            <Button
              size='sm' 
              color='primary' 
              variant='light'
              startContent={<HiPlus />}
              className='mt-1 px-1'
              onPress={handleAddItem}
            >
              new feature
            </Button>
          </div>
          <Button 
            color='primary' 
            className='mt-4 absolute bottom-4 left-4 right-4 bg-black'
            size='md'
            onPress={() => onGenerateDemo(funcList)}
            isDisabled={disabled}
            startContent={<StartIcon />}
          >
            Generate Demo
          </Button>
        </>
      )}
    </div>
  );
};
