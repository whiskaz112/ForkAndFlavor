import React, { useContext, useState } from 'react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BtnBox from "../Components/BtnBox";
import BtnLetter from "../Components/BtnLetter";
import BtnBack from "../Components/BtnBack";
import MessageContext from "../Components/MessageContext";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from '../Components/SortableItem';
import axios from 'axios'

function Createpost() {
    const [formData, setFormData] = useState({
        name: '',
        tags: ['', ''],
        cookTime: '',
        yieldValue: '',
        description: '',
        ingredients: [],
        instructions: [],
    })

    const [currentIngredient, setCurrentIngredient] = useState({ name: '', quantity: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleIngredientChange = (field) => (e) => {
        const value = e.target.value; // Access the value from the event
        setCurrentIngredient({
            ...currentIngredient,
            [field]: value, // Dynamically update the field based on the input name
        });
    };


    const handleInstructionChange = (index, value) => {
        const updatedInstructions = [...formData.instructions];
        updatedInstructions[index] = value;
        setFormData({ ...formData, instructions: updatedInstructions });
    };

    const addIngredient = (e) => {
        e.preventDefault();

        // Create a new ingredient object
        const newIngredient = { ...currentIngredient };

        // Add it to the ingredients array
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, newIngredient],
        });

        // Reset the current ingredient fields
        setCurrentIngredient({ name: '', quantity: '' });
    };

    const { input, setInput, handleSubmit, messages, setMessages } = useContext(MessageContext);

    const getMessagePos = id => messages.findIndex(mes => mes.id === id)

    const handleDragEnd = event => {
        const { active, over } = event

        if (active.id === over.id) return;

        setMessages(messages => {
            const originalPos = getMessagePos(active.id)
            const newPos = getMessagePos(over.id)

            return arrayMove(messages, originalPos, newPos)
        })
    }

    const handleFormSubmit = async (e) => {
        console.log(formData)
        e.preventDefault();

        // try {
        //     const response = await axios.post('http://localhost:5000/api/post', formData, {
        //         withCredentials: true,
        //     });

        //     console.log('Post created:', response.data);
        //     alert('Post created successfully!');
        // } catch (error) {
        //     console.error('Error creating post:', error);
        //     alert('Failed to create post');
        // }
    };

    return (
        <div className="Createpost">
            <header>
                <Navbar />
            </header>
            <main>
                <BtnBack path={-1} />
                <div className="Createpost__form">
                    <form onSubmit={handleFormSubmit}>
                        <div className="createpost-first-part">
                            <div className="Createpost__image">
                                <label htmlFor="file-input">
                                    <div className="box-input-image noto-sans-thai-looped-bold">
                                        <p>+ add a photo of your dish</p>
                                    </div>
                                </label>
                                <input type="file" id="file-input" accept="image/*" />
                            </div>
                            <div className="createpost-input-info noto-sans-thai-looped-bold">
                                <input
                                    type="text"
                                    name='name'
                                    className="fredoka"
                                    placeholder="Name..."
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name='text1'
                                    className="noto-sans-thai-looped-bold"
                                    placeholder="+ add tags"
                                    value={formData.tags[0]}
                                    onChange={(e) => {
                                        const newTags = [...formData.tags]; // Create a copy of the current array
                                        newTags[0] = e.target.value;       // Update only the specific index
                                        setFormData({ ...formData, tags: newTags });
                                    }}
                                />
                                <input
                                    type="text"
                                    name='text2'
                                    className="noto-sans-thai-looped-bold"
                                    placeholder="+ add tags"
                                    value={formData.tags[1]}
                                    onChange={(e) => {
                                        const newTags = [...formData.tags]; // Create a copy of the current array
                                        newTags[1] = e.target.value;       // Update only the specific index
                                        setFormData({ ...formData, tags: newTags });
                                    }}
                                />
                                <div>
                                    <label htmlFor="cook-time"><img src="./../../public/Image/Icon/FaRegClockB.svg" alt="Clock Icon" />&nbsp; Cook Time:</label>
                                    <input
                                        type="text"
                                        name="cookTime"
                                        id="cook-time"
                                        value={formData.cookTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="yield"><img src="./../../public/Image/Icon/usersB.svg" alt="Users Icon" />&nbsp; Yield:</label>
                                    <input
                                        type="text"
                                        name='yieldValue'
                                        id="yield"
                                        value={formData.yieldValue}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="noto-sans-thai-looped-bold"
                                    placeholder="description..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="createpost-second-part">
                            <div className="ingredient-box">
                                <div className="ingredient-box-input fredoka">
                                    <div>
                                        <label htmlFor="ingredients">Ingredients</label>
                                        <input
                                            type="text"
                                            id="ingredients"
                                            value={currentIngredient.name}
                                            onChange={handleIngredientChange('name')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="quantity">Quantity</label>
                                        <input
                                            type="text"
                                            id="quantity"
                                            value={currentIngredient.quantity}
                                            onChange={handleIngredientChange('quantity')}
                                        />
                                    </div>
                                    {/* <button type="button"><img src="./../../public/Image/Icon/trashcan.svg" alt="Trashcan Icon" /></button> */}
                                </div>
                                <ul>
                                    {formData.ingredients.map((ingredient, index) => (
                                        <li key={index}>
                                            {ingredient.name}: {ingredient.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <BtnLetter name="+ ingredient" type="button" onClick={addIngredient} />
                                <img className="end-box-input" src="./../../public/Image/Icon/end-box-ingredient.svg" alt="End Box Icon" />
                            </div>
                            <div className="instruction-box-input fredoka">
                                <label htmlFor="instruction">Instruction</label>
                                <button type="button"><img src="./../../public/Image/Icon/trashcan.svg" alt="Trashcan Icon" /></button>
                                <input
                                    type="text"
                                    id="instruction"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <BtnLetter name="+ add a photo" />
                                <div>
                                    <BtnLetter name="+ section" onClick={(e) => handleSubmit(e, 'section')} />
                                    <BtnLetter name="+ instruction" onClick={(e) => handleSubmit(e, 'instruction')} />
                                </div>
                                <button type="button"><img src="./../../public/Image/Icon/hamburger.svg" alt="Hamburger Icon" /></button>
                            </div>
                        </div>
                        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                            <SortableContext items={messages} strategy={verticalListSortingStrategy}>
                                {messages.map((mes) => (
                                    <SortableItem key={mes.id} mes={mes} />
                                ))}
                            </SortableContext>
                        </DndContext>
                        <div className='btn-group-createpost'>
                            <BtnBox name="Cancel" />
                            <BtnBox name="Post" type="submit" onClick={handleFormSubmit} />
                        </div>
                    </form>
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Createpost;