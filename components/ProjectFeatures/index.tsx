'use client';
import { useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Button, Textarea, Skeleton, Card } from '@heroui/react';
import { v4 as uuidv4 } from 'uuid';
import { HiPlus, HiOutlineTrash } from 'react-icons/hi';
import { LuGripVertical } from 'react-icons/lu';
import { PiArrowBendDownLeftBold } from 'react-icons/pi';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
import { useSet } from '@/utils/hooks';
import Toast from '@/components/base/toast';

const ListSkeleton = () => {
  const list = Array(5).fill(0);
  return (
    <div className='px-6 mt-12'>
      {list.map((_, index: number) => (
        <Card
          className='p-4 mb-6 border-none'
          shadow='sm'
          radius='sm'
          isHoverable={true}
          key={index}
        >
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
};

const DraggableItem = ({
  item,
  onSvae,
  onDelete,
  onEdit,
  editingId,
  editingText,
  setState,
  editorRef,
}: any) => {
  const { setNodeRef, listeners, transform, isDragging, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex items-center space-x-2 border border-gray-200 px-6 py-4 rounded-lg bg-white"
    >
      <LuGripVertical className="cursor-pointer text-gray-500" size={20} />
      {editingId === item.id ? (
        <Textarea
          ref={editorRef}
          value={editingText}
          onChange={(e) => setState({ editingText: e.target.value })}
          onBlur={() => onSvae(item.id)}
          className="flex-1 border-none bg-transparent outline-none"
        />
      ) : (
        <div
          className="flex-1 cursor-pointer py-1 pl-5 pr-3"
          onClick={() => onEdit(item.id, item.description)}
        >
          {item.name ? item.name + '，' + item.description : item.description}
        </div>
      )}
      <HiOutlineTrash
        onClick={() => onDelete(item.id)}
        className="cursor-pointer"
        size={16}
      />
    </div>
  );
};

export default forwardRef((props: any, ref: any) => {
  const { showSkeleton, onGenerateDemo } = props;
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
    console.log(props.data, '______++++');
    setState({ funcList: props.data || [] });
  }, [JSON.stringify(props.data)]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.focus();
  }, [editingId]);

  useImperativeHandle(ref, () => ({
    generateDemo: () => onGenerateDemo(funcList),
  }));

  const handleAddItem = () => {
    if (!textareaValue) {
      return;
    }
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
    setState({ funcList: funcList.filter((item: any) => item.id !== id) });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      const oldIndex = funcList.findIndex(
        (item: any) => item.id === active?.id
      );
      const newIndex = funcList.findIndex((item: any) => item.id === over?.id);
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
      funcList: funcList.map((item: any) =>
        item.id === id ? { ...item, description: editingText } : item
      ),
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    })
  );

  return (
    <div className='w-[85%] py-6 border-t border-gray-100 mx-auto relative flex flex-col'>
      {showSkeleton ? (
        <ListSkeleton />
      ) : (
        <>
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext
              items={funcList}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-3 flex-1 h-0 overflow-auto px-6'>
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
          <div className='mt-10 mb-3 px-6'>
            Have more thoughts? Add them below
          </div>
          <div className='px-6 mb-16 relative'>
            <Textarea
              placeholder='Add more functions here.'
              ref={textareaRef}
              value={textareaValue}
              onChange={(ev) => setState({ textareaValue: ev.target.value })}
              classNames={{
                inputWrapper: 'bg-white border border-gray-200 rounded-lg',
                // input: 'placeholder:text-[12px]'
              }}
            />
            {/* <Button
              color='primary'
              variant='light'
              startContent={<HiPlus />}
              className='mt-1 px-1 absolute right-6 top-1'
              onPress={handleAddItem}
            >
              new feature
            </Button> */}
            <button
              //color='primary'
              //variant='light'
              //startContent={<HiPlus />}
              className=' absolute right-8 bottom-2 bg-black rounded-md p-0 flex justify-center items-center'
              style={{ height: '40px', width: '40px' }}
              onClick={handleAddItem}
            >
              <PiArrowBendDownLeftBold color='white' size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
});
