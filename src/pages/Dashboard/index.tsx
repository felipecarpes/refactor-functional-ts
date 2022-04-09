import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodTypes {
    id: number;
    name: string;
    description: string;
    price: string;
    available: boolean;
    image: string;
}

const Dashboard = () => {
    const [foods, setFoods] = useState<FoodTypes[]>([]);
    const [editingFood, setEditingFood] = useState<FoodTypes>({} as FoodTypes);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get('/foods');
            return response.data
        }

        fetchData()
            .then(response => setFoods(response))
            .catch(err => err)
    }, [])

    const handleAddFood = async (food: FoodTypes) => {
        try {
            const response = await api.post('/foods', {
                ...food,
                available: true,
            });

            setFoods([...foods, response.data]);
        } catch (err) {
            console.log(err);
        }
    }

    const handleUpdateFood = async (food: FoodTypes) => {
        try {
            const foodUpdated = await api.put(
                `/foods/${editingFood.id}`,
                { ...editingFood, ...food },
            );

            const foodsUpdated = foods.map(f =>
                f.id !== foodUpdated.data.id ? f : foodUpdated.data,
            );

            setFoods([...foods, foodsUpdated])
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteFood = async (id: number) => {
        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter(food => food.id !== id);

        setEditingFood({...foods, foodsFiltered})
    }

    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    const toggleEditModal = () => {
        setEditModalOpen(!editModalOpen)
    }

    const handleEditFood = (food: FoodTypes) => {
        setEditingFood(food)
        setEditModalOpen(true)
    }

    return (
        <>
            <Header openModal={toggleModal} />
            <ModalAddFood
                isOpen={modalOpen}
                setIsOpen={toggleModal}
                handleAddFood={handleAddFood}
            />
            <ModalEditFood
                isOpen={editModalOpen}
                setIsOpen={toggleEditModal}
                editingFood={editingFood}
                handleUpdateFood={handleUpdateFood}
            />

            <FoodsContainer data-testid="foods-list">
                {foods &&
                    foods.map(food => (
                        <Food
                            key={food.id}
                            food={food}
                            handleDelete={handleDeleteFood}
                            handleEditFood={handleEditFood}
                        />
                    ))
                }
            </FoodsContainer>
        </>
    )
}

export default Dashboard;
