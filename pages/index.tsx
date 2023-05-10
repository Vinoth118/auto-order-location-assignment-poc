import { Button, Flex, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalOverlay, ModalContent, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, CloseButton, IconButton, useToast } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';
import { DeleteIcon } from '@chakra-ui/icons';
const DragDropContext = dynamic({
    loader: async () => {
        const module = await import('react-beautiful-dnd');
        return module.DragDropContext
    },
    ssr: false,
});

type AssignedItem = {
    location: string | null,
    listing: string,
    variant: string,
    quantity: number
}

const INITIAL_DATA = {
    locations: [
        { name: 'Kochi warehouse', _id: 'kochi', priority: 1, isDefault: false },
        { name: 'Ariyalur warehouse', _id: 'ariyalur', priority: 2, isDefault: false },
        { name: 'Trichy warehouse', _id: 'trichy', priority: 3, isDefault: false },
        { name: 'Chennai warehouse', _id: 'chennai', priority: 4, isDefault: true },
    ],
    inventories: [
        { listing: 'iphone', variant: 'iphone', location: 'kochi', commited: 0, quantity: 4 },
        { listing: 'iphone', variant: 'iphone', location: 'ariyalur', commited: 0, quantity: 15 },
        { listing: 'iphone', variant: 'iphone', location: 'trichy', commited: 0, quantity: 5 },
        { listing: 'iphone', variant: 'iphone', location: 'chennai', commited: 0, quantity: 5 },
        { listing: 'shirt', variant: 'shirt', location: 'kochi', commited: 0, quantity: 3 },
        { listing: 'shirt', variant: 'shirt', location: 'ariyalur', commited: 0, quantity: 2 },
        { listing: 'shirt', variant: 'shirt', location: 'trichy', commited: 0, quantity: 10 },
        { listing: 'shirt', variant: 'shirt', location: 'chennai', commited: 0, quantity: 5 },
        { listing: 'bag', variant: 'bag', location: 'kochi', commited: 0, quantity: 5 },
        { listing: 'bag', variant: 'bag', location: 'ariyalur', commited: 0, quantity: 5 },
        { listing: 'bag', variant: 'bag', location: 'trichy', commited: 0, quantity: 5 },
        { listing: 'bag', variant: 'bag', location: 'chennai', commited: 0, quantity: 5 },
    ],
    products: ['iphone', 'shirt', 'bag'],
    order: [
        { listing: 'iphone', variant: 'iphone', quantity: 25 },
        { listing: 'shirt', variant: 'shirt', quantity: 16 },
        { listing: 'bag', variant: 'bag', quantity: 24 },
        { listing: 'shoes', variant: 'shoes', quantity: 45 },
        { listing: 'pant', variant: 'pant', quantity: 18 },
        { listing: 'mat', variant: 'mat', quantity: 24 },
        { listing: 'watch', variant: 'watch', quantity: 14 },
        { listing: 'socks', variant: 'socks', quantity: 27 },
        { listing: 'fridge', variant: 'fridge', quantity: 33 },
        { listing: 'hard disk', variant: 'hard disk', quantity: 27 },
    ]
}

const Home: NextPage = () => {
    const [locations, setLocations] = useState(INITIAL_DATA.locations);
    const [location, setLocation] = useState('');
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState(INITIAL_DATA.products);
    const [inventories, setInventories] = useState(INITIAL_DATA.inventories);
    const [order, setOrder] = useState(INITIAL_DATA.order);
    const [currentEditingOrder, setCurrentEditingOrder] = useState([
        { listing: 'iphone', variant: 'iphone', quantity: 5 },
        { listing: 'shirt', variant: 'shirt', quantity: 3 }
    ]);
    const [locationAssignedItemsByAlgorith1, setLocationAssignedItemsByAlgorithm1] = useState([
        { location: 'chennai' as string | null, items: [ 
            { listing: 'iphone', variant: 'iphone', quantity: 5 }, 
            { listing: 'shirt', variant: 'shirt', quantity: 3 } 
        ]  }
    ])
    const [locationAssignedItemsByAlgorith2, setLocationAssignedItemsByAlgorithm2] = useState([
        { location: 'chennai' as string | null, items: [ 
            { listing: 'iphone', variant: 'iphone', quantity: 5 }, 
            { listing: 'shirt', variant: 'shirt', quantity: 3 } 
        ]  }
    ])
    const [locationAssignedItemsByAlgorith3, setLocationAssignedItemsByAlgorithm3] = useState([
        { location: 'chennai' as string | null, items: [ 
            { listing: 'iphone', variant: 'iphone', quantity: 5 }, 
            { listing: 'shirt', variant: 'shirt', quantity: 3 } 
        ]  }
    ])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        let localLocations: any = localStorage.getItem('locations');
        let localProducts: any =  localStorage.getItem('products');
        let localInventories: any = localStorage.getItem('inventories');
        if(localLocations && localLocations != '') {
            try { localLocations = JSON.parse(localLocations); if(localLocations?.length > 0) setLocations(localLocations); } catch (e) {}
        }
        if(localProducts && localProducts != '') {
            try { localProducts = JSON.parse(localProducts); if(localProducts?.length > 0) setProducts(localProducts); } catch (e) {}
        }
        if(localInventories && localInventories != '') {
            try { localInventories = JSON.parse(localInventories); if(localInventories?.length > 0) setInventories(localInventories); } catch (e) {}
        }
    }, [])

    const updateLocalStorageData = (toBeUpdatedLocations: any, toBeUpdatedProducts: any, toBeUpdatedInventories: any) => {
        localStorage.setItem('locations', JSON.stringify(toBeUpdatedLocations));
        localStorage.setItem('products', JSON.stringify(toBeUpdatedProducts));
        localStorage.setItem('inventories', JSON.stringify(toBeUpdatedInventories));
    }

    const onClickDefaultData = () => {
        setLocations(INITIAL_DATA.locations);
        setProducts(INITIAL_DATA.products);
        setInventories(INITIAL_DATA.inventories);
        localStorage.setItem('locations', JSON.stringify(INITIAL_DATA.locations));
        localStorage.setItem('products', JSON.stringify(INITIAL_DATA.products));
        localStorage.setItem('inventories', JSON.stringify(INITIAL_DATA.inventories));
    }
    
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const toBeUpdatedLocations = Array.from(locations);
        const [removed] = toBeUpdatedLocations.splice(result.source.index, 1);
        toBeUpdatedLocations.splice(result.destination.index, 0, removed);
        toBeUpdatedLocations.forEach((e, index) => e.priority = index);
        setLocations(toBeUpdatedLocations);
        updateLocalStorageData(toBeUpdatedLocations, products, inventories)
    }

    const onClickLocationExport = () => {
        prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(locations))
    }

    const onClickLocationImport = () => {
        const importedData = prompt('Paste the exported data: Ctrl+V, Enter');
        if(importedData == '' || importedData == null) return ;
        try {
            const parsedData = JSON.parse(importedData);
            if(parsedData?.[0] == null || parsedData?.[0]?.hasOwnProperty('name') == false || parsedData?.[0]?.hasOwnProperty('priority') == false) return ;
            setLocations(parsedData)
            updateLocalStorageData(parsedData, products, inventories);
        } catch(e) {}
    }

    const onClickInventoryExport = () => {
        window.navigator.clipboard.writeText(JSON.stringify({ products, inventories }));
        toast({
            status: 'success',
            title: 'Copied to clipboard',
            isClosable: true,
            position: 'top'
        })
    }

    const onClickInventoryImport = () => {
        const importedData = prompt('Paste the exported data: Ctrl+V, Enter');
        if(importedData == '' || importedData == null) return ;
        try {
            const parsedData = JSON.parse(importedData);
            if(parsedData?.hasOwnProperty('products') && parsedData?.hasOwnProperty('inventories')) {
                parsedData.inventories = parsedData.inventories.filter((e: any) => locations.findIndex(location => location._id == e.location) > -1)
                setProducts(parsedData.products)
                setInventories(parsedData.inventories);
                updateLocalStorageData(locations, parsedData.products, parsedData.inventories);
            }
        } catch(e) {}
    }

    const onClickSetAsDefault = (locationId: string) => {
        const toBeUpdatedLocations = Array.from(locations);
        toBeUpdatedLocations.forEach(e => {
            e.isDefault = false;
            if(e._id == locationId) e.isDefault = true;
        })
        setLocations(toBeUpdatedLocations);
        updateLocalStorageData(toBeUpdatedLocations, products, inventories)
    }

    const onChangeInventory = (event: ChangeEvent<HTMLInputElement>, locationId: string, product: string) => {
        const toBeUpdatedInventories = Array.from(inventories);
        const existingInventoryIndex = toBeUpdatedInventories.findIndex(e => e.location == locationId && e.listing == product);
        let toBeUpdatedValue: any = event.target.value == '' ? '0' : event.target.value;
        toBeUpdatedValue = toBeUpdatedValue == '0' ? '0' : parseInt(toBeUpdatedValue.replace(/^0+/, ''));
        if(existingInventoryIndex > -1) {
            toBeUpdatedInventories[existingInventoryIndex].quantity = toBeUpdatedValue;
        } else {
            toBeUpdatedInventories.push({ listing: product, variant: product, location: locationId, quantity: toBeUpdatedValue, commited: 0 });
        }
        setInventories(toBeUpdatedInventories);
        updateLocalStorageData(locations, products, toBeUpdatedInventories)
    }

    const onClickAddLocation = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(location == '' || locations.findIndex(e => e._id == location.toLowerCase()) > -1) return ;
        setLocation('');
        const toBeUpdatedLocations = [ ...locations, { _id: location.toLowerCase(), name: location, isDefault: false, priority: locations.length } ];
        setLocations(toBeUpdatedLocations);
        updateLocalStorageData(toBeUpdatedLocations, products, inventories);
    }

    const onClickAddProduct = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(product == '' || products.includes(product)) return ;
        setProduct('');
        const toBeUpdatedProducts = [ ...products, product ];
        setProducts(toBeUpdatedProducts);
        updateLocalStorageData(locations, toBeUpdatedProducts, inventories);
    }

    const onClickDeleteLocation = (locationId: string) => {
        let toBeUpdatedLocations = Array.from(locations);
        let toBeUpdatedInventories = Array.from(inventories);
        toBeUpdatedLocations = toBeUpdatedLocations.filter(e => e._id != locationId).map((e, index) => { e.priority =  index; return e });
        toBeUpdatedInventories = toBeUpdatedInventories.filter(e => e.location != locationId);
        setLocations(toBeUpdatedLocations);
        setInventories(toBeUpdatedInventories);
        updateLocalStorageData(toBeUpdatedLocations, products, toBeUpdatedInventories);
    }

    const onClickDeleteProduct = (productId: string) => {
        let toBeUpdatedInventories = Array.from(inventories);
        let toBeUpdatedProducts = Array.from(products);
        toBeUpdatedProducts = products.filter(e => e != productId);
        toBeUpdatedInventories = inventories.filter(e => e.listing != productId);
        setProducts(toBeUpdatedProducts);
        setInventories(toBeUpdatedInventories);

        setOrder(prev => (prev.filter(e => e.listing != productId)))
        setCurrentEditingOrder(prev => (prev.filter(e => e.listing != productId)));

        updateLocalStorageData(locations, toBeUpdatedProducts, toBeUpdatedInventories);
    }

    const onChangeOrder = (event: ChangeEvent<HTMLInputElement>, product: string) => {
        let toBeUpdatedOrderDetails: { listing: string, variant: string, quantity: number }[] = JSON.parse(JSON.stringify(currentEditingOrder));
        const existingOrderItemIndex = toBeUpdatedOrderDetails.findIndex(e => e.listing == product);
        let toBeUpdatedValue: any = event.target.value == '' ? '0' : event.target.value;
        toBeUpdatedValue = toBeUpdatedValue == '0' ? '0' : parseInt(toBeUpdatedValue.replace(/^0+/, ''));
        if(existingOrderItemIndex > -1) {
            toBeUpdatedOrderDetails[existingOrderItemIndex].quantity = toBeUpdatedValue;
        } else {
            toBeUpdatedOrderDetails.push({ listing: product, variant: product, quantity: toBeUpdatedValue })
        }
        toBeUpdatedOrderDetails = toBeUpdatedOrderDetails.filter(e => e.quantity > 0);
        setCurrentEditingOrder(toBeUpdatedOrderDetails);
    }

    const getAlgorithm1Result = () => {
        type AssignedItem = {
            location: string | null,
            listing: string,
            variant: string,
            quantity: number
        }
        const assignedItems: AssignedItem[] = [];

        for (const orderItem of currentEditingOrder) {
            let isConditionSatishfied = false;
            const sortedLocationsByPriority = [...locations].sort((a, b) => a.priority < b.priority ? 1 : -1);
            const sortedListingInventoriesByLocationPriority = [...inventories].filter(inventory => inventory.listing == orderItem.listing && inventory.variant == orderItem.variant).sort((a, b) => {
                const aPriority = sortedLocationsByPriority.find(loc => loc._id === a.location)?.priority ?? 0;
                const bPriority = sortedLocationsByPriority.find(loc => loc._id === b.location)?.priority ?? 0;
                return aPriority - bPriority;
            })

            // First condition - check default location inventory if it can fullfill the required quantity
            const defaultLocation = locations.find(e => e.isDefault);
            const inventoryOnDefaultLocation = inventories.find(e => e.location == defaultLocation?._id && e.listing == orderItem.listing && e.variant == orderItem.variant);
            const defaultLocationAvailableQuantity = (inventoryOnDefaultLocation?.quantity ?? 0) - (inventoryOnDefaultLocation?.commited ?? 0);
            if(defaultLocation && defaultLocationAvailableQuantity >= orderItem.quantity) {
                assignedItems.push({ ...orderItem, location: defaultLocation?._id });
                isConditionSatishfied = true;
            }

            if(isConditionSatishfied) continue;

            // Second condition - check the higher priority location inventory if it can fullfill the required quantity
            for (const inventory of sortedListingInventoriesByLocationPriority) {
                const availableQuantity = inventory.quantity - inventory.commited;
                if(availableQuantity >= orderItem.quantity) {
                    assignedItems.push({ ...orderItem, location: inventory.location });
                    isConditionSatishfied = true;

                    // To check and update if the previous assigned items can be fulfilled by the current location
                    // for (const [index, assingedItem] of assignedItems.slice(0, -1).entries()) {
                    //     const isMultipleItemsAssignedWithTheSameCurrentLocation = assignedItems.filter(e => e.location == assingedItem.location).length > 1;
                    //     const isAssignedItemIsSplittedByQuantity = assignedItems.filter(e => e.listing == assingedItem.listing && e.variant == assingedItem.variant).length > 1;
                    //     const assignedItemInventoryForCurrentLocation = inventories.find(e => e.location == inventory.location && e.listing == assingedItem.listing && e.variant == assingedItem.variant);
                    //     const availableQuantity = (assignedItemInventoryForCurrentLocation?.quantity ?? 0) - (assignedItemInventoryForCurrentLocation?.commited ?? 0)
                    //     if(!isMultipleItemsAssignedWithTheSameCurrentLocation && !isAssignedItemIsSplittedByQuantity && availableQuantity >= assingedItem.quantity) {
                    //         assignedItems[index].location = inventory.location;
                    //     }
                    // }

                    break;
                }
            }

            if(isConditionSatishfied) continue;

            // Third condition - sort the location based on available quantity and priority. And then split quantities with different locations.
            const sortedListingInventoriesByLocationQuantityAndPriority = [...inventories].filter(inventory => inventory.listing == orderItem.listing && inventory.variant == orderItem.variant).sort((a, b) => {
                const aPriority = sortedLocationsByPriority.find(loc => loc._id === a.location)?.priority ?? 0;
                const bPriority = sortedLocationsByPriority.find(loc => loc._id === b.location)?.priority ?? 0;
                const aAvailableQuantity = a.quantity - a.commited;
                const bAvailableQuantity = b.quantity - b.commited;
                if(aAvailableQuantity == bAvailableQuantity) {
                    return aPriority - bPriority;
                }
                return bAvailableQuantity - aAvailableQuantity;
            });
            let notFulfiledItemQuantity = orderItem.quantity;
            for (const inventory of sortedListingInventoriesByLocationQuantityAndPriority) {
                const availableQuantity = inventory.quantity - inventory.commited;
                const assignableQuantity = availableQuantity > notFulfiledItemQuantity ? notFulfiledItemQuantity : availableQuantity;
                if(notFulfiledItemQuantity < 1) break;
                if(availableQuantity > 0 && notFulfiledItemQuantity > 0) {
                    assignedItems.push({ ...orderItem, quantity: assignableQuantity, location: inventory.location });
                    notFulfiledItemQuantity -= assignableQuantity;
                }
            }
            if(notFulfiledItemQuantity > 0) {
                assignedItems.push({ ...orderItem, quantity: notFulfiledItemQuantity, location: null })
            }
        
        }

        return assignedItems;
    }

    const getAlgorithm2Result = () => {
        const assignedItems = getAlgorithm1Result();

        let assignedItemsGrupedByLocation = assignedItems.reduce((data, item) => {
            const existItemWithSameLocationIndex = data.findIndex(e => e.location == item.location);
            if(existItemWithSameLocationIndex > -1) {
                data[existItemWithSameLocationIndex].items.push({ listing: item.listing, variant: item.variant, quantity: item.quantity })
            } else {
                data.push({ location: item.location, items: [ { listing: item.listing, variant: item.variant, quantity: item.quantity } ] });
            }
            return data;
        }, [] as { location: string | null, items: { listing: string, variant: string, quantity: number }[] } []);

        assignedItemsGrupedByLocation.sort((a, b) => a.items.length > b.items.length ? 1 : -1);

        assignedItemsGrupedByLocation.forEach(groupedItem => {
            groupedItem.items.forEach(item => {
                const inventoriesForCurrentItem = inventories.filter(e => e.listing == item.listing && e.variant == item.variant);
                let isAssigned = false;
                const index = assignedItemsGrupedByLocation.findIndex(e => e.location == groupedItem.location);
                
                const restOfGroupedItemsFromCurrentItem = assignedItemsGrupedByLocation.slice(index+1);
                restOfGroupedItemsFromCurrentItem.forEach(itemFromRestOfGroupedItems => {
                    const inventoryForCurrentItem = inventoriesForCurrentItem.find(e => e.location == itemFromRestOfGroupedItems.location);
                    const availableQuantity = (inventoryForCurrentItem?.quantity ?? 0) - (inventoryForCurrentItem?.commited ?? 0);
                    if(availableQuantity >= item.quantity) {
                        const currentItemIndexFromAssignedItemsGrupedByLocation = assignedItemsGrupedByLocation.findIndex(e => e.location == itemFromRestOfGroupedItems.location);
                        const isAlreadyExistInCurrentGroupedItem = itemFromRestOfGroupedItems.items.findIndex(e => e.listing == item.listing && e.variant == item.variant) > -1;
                        if(!isAlreadyExistInCurrentGroupedItem) {
                            assignedItemsGrupedByLocation[currentItemIndexFromAssignedItemsGrupedByLocation].items.push(item);
                            groupedItem.items = groupedItem.items.filter(e => e.listing != item.listing && e.variant != item.variant);
                            isAssigned = true;
                        } 
                    }
                })

                assignedItemsGrupedByLocation = assignedItemsGrupedByLocation.filter(e => e.items.length > 0);

                if(isAssigned) return ;
                const previousGroupedItemsFromCurrentItem = assignedItemsGrupedByLocation.slice(0, index).reverse();
                previousGroupedItemsFromCurrentItem.forEach(itemFromRestOfGroupedItems => {
                    const inventoryForCurrentItem = inventoriesForCurrentItem.find(e => e.location == itemFromRestOfGroupedItems.location);
                    const availableQuantity = (inventoryForCurrentItem?.quantity ?? 0) - (inventoryForCurrentItem?.commited ?? 0);
                    if(availableQuantity >= item.quantity) {
                        const currentItemIndexFromAssignedItemsGrupedByLocation = assignedItemsGrupedByLocation.findIndex(e => e.location == itemFromRestOfGroupedItems.location);
                        const isAlreadyExistInCurrentGroupedItem = itemFromRestOfGroupedItems.items.findIndex(e => e.listing == item.listing && e.variant == item.variant) > -1;
                        if(!isAlreadyExistInCurrentGroupedItem) {
                            assignedItemsGrupedByLocation[currentItemIndexFromAssignedItemsGrupedByLocation].items.push(item);
                            groupedItem.items = groupedItem.items.filter(e => e.listing != item.listing && e.variant != item.variant);
                            isAssigned = true;
                        }
                    }
                })
                
                assignedItemsGrupedByLocation = assignedItemsGrupedByLocation.filter(e => e.items.length > 0);
            })
        })

        const assignedItemss = assignedItemsGrupedByLocation.filter(e => e.items.length > 0).reduce((data, item) => {
            data = [...data, ...item.items.map(e => ({ ...e, location: item.location }))];
            return data;
        }, [] as AssignedItem[])

        return assignedItemss;
    }

    const getAlgorithm3Result = () => {
        type AssignedItem = {
            location: string | null,
            listing: string,
            variant: string,
            quantity: number
        }
        const assignedItems: AssignedItem[] = [];

        const locationsWithInventories = inventories.reduce((data, inventory) => {
            const existingIndex = data.findIndex(e => e.location == inventory.location);
            if(existingIndex > -1) {
                data[existingIndex].items.push({ listing: inventory.listing, variant: inventory.variant, availableQuantity: inventory.quantity - inventory.commited });
            } else {
                data.push({ location: inventory.location, items: [{ listing: inventory.listing, variant: inventory.variant, availableQuantity: inventory.quantity - inventory.commited }] })
            }
            return data;
        }, [] as { location: string, items: { listing: string, variant: string, availableQuantity: number }[] }[])

        const sortedLocationsByProbabilityAndPriority = locationsWithInventories.map(locationWithInventories => {
            let probability = 0;
            const priority = locations.find(e => e._id == locationWithInventories.location)?.priority ?? 0;
            currentEditingOrder.forEach(item => {
                const itemInventory = locationWithInventories.items.find(e => e.listing == item.listing && e.variant == item.variant);
                if(itemInventory && itemInventory.availableQuantity >= item.quantity) probability += 1;
            })
            return { location: locationWithInventories.location, priority, probability }
        }).sort((a, b) => {
            if(b.probability == a.probability) return a.priority - b.priority;
            return b.probability - a.probability
        });

        for(const locationWithProbability of sortedLocationsByProbabilityAndPriority) {
            const currentLocationInventories = locationsWithInventories.find(e => e.location == locationWithProbability.location);
            if(!currentLocationInventories) continue;
            currentEditingOrder.forEach(orderItem => {
                const inventory = currentLocationInventories.items.find(e => e.listing == orderItem.listing && e.variant == orderItem.variant);
                const isExist = assignedItems.findIndex(e => e.listing == orderItem.listing && e.variant == orderItem.variant) > -1;
                if(!isExist && inventory && inventory.availableQuantity >= orderItem.quantity) {
                    assignedItems.push({ ...orderItem, location: locationWithProbability.location });
                }
            })
        }

        const unAssignedItems = currentEditingOrder.filter(e => assignedItems.findIndex(assignedItem => assignedItem.listing == e.listing && assignedItem.variant == e.variant) < 0);

        for(const unAssignedItem of unAssignedItems) {
            let unAssignedQuantity = unAssignedItem.quantity;
            
            for(const locationWithProbability of sortedLocationsByProbabilityAndPriority) {
                if(unAssignedQuantity < 1) break;
                const currentLocationInventories = locationsWithInventories.find(e => e.location == locationWithProbability.location);
                if(!currentLocationInventories) continue;
                const inventory = currentLocationInventories.items.find(e => e.listing == unAssignedItem.listing && e.variant == unAssignedItem.variant);
                if(inventory && unAssignedQuantity > 0 && inventory.availableQuantity > 0) {
                    const toBeAssignedQuantity = inventory.availableQuantity >= unAssignedQuantity ? unAssignedQuantity : inventory.availableQuantity;
                    assignedItems.push({ ...unAssignedItem, location: locationWithProbability.location, quantity: toBeAssignedQuantity });
                    unAssignedQuantity -= toBeAssignedQuantity;
                }
            }

            if(unAssignedQuantity > 0) {
                assignedItems.push({ ...unAssignedItem, location: null, quantity: unAssignedQuantity });
            }
        }
        
        return assignedItems;
    }

    const onClickSaveOrder = () => {
        setOrder(currentEditingOrder);
        const algo1Result = getAlgorithm1Result();
        const algo2Result = getAlgorithm2Result();
        const algo3Result = getAlgorithm3Result();

        const groupByLocation = (items: AssignedItem[]) => {
            return items.reduce((data, item) => {
                const existItemWithSameLocationIndex = data.findIndex(e => e.location == item.location);
                if(existItemWithSameLocationIndex > -1) {
                    data[existItemWithSameLocationIndex].items.push({ listing: item.listing, variant: item.variant, quantity: item.quantity })
                } else {
                    data.push({ location: item.location, items: [ { listing: item.listing, variant: item.variant, quantity: item.quantity } ] });
                }
                return data;
            }, [] as { location: string | null, items: { listing: string, variant: string, quantity: number }[] } []);
        }

        setLocationAssignedItemsByAlgorithm1(groupByLocation(algo1Result));
        setLocationAssignedItemsByAlgorithm2(groupByLocation(algo2Result));
        setLocationAssignedItemsByAlgorithm3(groupByLocation(algo3Result));
        onClose();
    }

    return (
        <Flex w = '100%' gridGap={'20px'} direction={'column'}>

            <Modal size = 'lg' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction={'column'} gridGap={'10px'}>
                            {products.map((product, index) => {
                                const quantity = currentEditingOrder.find(e => e.listing == product)?.quantity;
                                return <Flex key = {index} alignItems={'center'}>
                                    <Text w = '50%'>{product}</Text>
                                    <Input type = 'number' onChange = {(event) => onChangeOrder(event, product)} value = {quantity?.toString() ?? 0} />
                                    <IconButton icon={<Icon as={DeleteIcon} />} _hover = {{bg: 'red'}} bg='red.500' color='white' ml='20px' w='40px' h='40px' aria-label={'locationDeleteIcon'} />
                                </Flex>
                            })}
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>Close</Button>
                        <Button onClick = {onClickSaveOrder} colorScheme='green'>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Flex w = '100%' p = '20px' gridGap = '20px' bg = 'gray.400'>
                <Button onClick = {onClickDefaultData} w = '100%'>Import Default Data</Button>
            </Flex>

            <Flex w = '100%' p = '20px' gridGap = '20px' bg = 'gray.400' direction={'column'}>
                <Flex gridGap = '20px' w = '100%'>
                    <Button onClick = {onClickLocationExport} w = '100%'>Export</Button>
                    <Button onClick = {onClickLocationImport} w = '100%'>Import</Button>
                </Flex>
                <form>
                    <Flex w = '100%' gridGap = '20px'>
                        <Input placeholder = 'Enter location name' bg = 'white' value  = {location} onChange={e => setLocation(e.target.value)} />
                        <Button flexShrink = {0} type= 'submit' onClick={onClickAddLocation}>Add Location</Button>
                    </Flex>
                </form>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, _) => (
                            <Flex w = '100%' direction={'column'} gridGap = '10px' {...provided.droppableProps} ref={provided.innerRef}>
                                {
                                    locations.map((location, index) => (
                                        <Draggable key={location._id} draggableId={location._id} index={index}>
                                            {(provided, _) => (
                                                <Flex 
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    px = '20px'
                                                    minH = '60px'
                                                    w = '100%'
                                                    bg = 'white'
                                                    justifyContent={'space-between'}
                                                    alignItems={'center'}
                                                >
                                                    <Flex gridGap = '20px' alignItems = 'center'>
                                                        <Text>{location.name}</Text>
                                                        <Text display = {location.isDefault ? 'flex' : 'none'} h = 'min-content' borderRadius={'10px'} px = '10px' bg = 'gray.300'>Default</Text>
                                                    </Flex>
                                                    <Flex gridGap = '20px'>
                                                        <Button onClick = {() => onClickSetAsDefault(location._id)} display = {!location.isDefault ? 'flex' : 'none'}>Set as default</Button>
                                                        <IconButton onClick = {() => onClickDeleteLocation(location._id)} icon={<Icon as={DeleteIcon} />} _hover = {{bg: 'red'}} bg='red.500' color='white' w='40px' h='40px' aria-label={'orderProductDeleteIcon'} />
                                                    </Flex>
                                                </Flex>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </Flex>
                        )}
                    </Droppable>
                </DragDropContext>
            </Flex>
            
            <Flex w = '100%' p = '20px' gridGap = '20px' bg = 'gray.400' direction={'column'}>
                <Flex gridGap = '20px' w = '100%'>
                    <Button onClick = {onClickInventoryExport} w = '100%'>Export</Button>
                    <Button onClick = {onClickInventoryImport} w = '100%'>Import</Button>
                </Flex>
                <form>
                    <Flex w = '100%' gridGap = '20px'>
                        <Input placeholder = 'Enter product name' bg = 'white' value  = {product} onChange={e => setProduct(e.target.value)} />
                        <Button flexShrink = {0} type = 'submit' onClick={onClickAddProduct}>Add Product</Button>
                    </Flex>
                </form>
                <TableContainer w = '100%'>
                    <Table bg = 'white'>
                        <Thead>
                            <Tr>
                                <Th>Location</Th>
                                {products.map((product, index) => {
                                    return <Th key = {index}>
                                        <Flex gridGap = '10px' alignItems = 'center'>
                                            <Text>{product}</Text>
                                            <IconButton onClick = {() => onClickDeleteProduct(product)} icon={<Icon as={DeleteIcon} />} _hover = {{bg: 'red'}} bg='red.500' borderRadius = '50%' color='white' size = 'xs' aria-label={'productDeleteIcon'} />
                                        </Flex>
                                    </Th>
                                })}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {locations.map((location, index) => {
                                return <Tr key = {index}>
                                    <Td>{location.name}</Td>
                                    {products.map((product, prodIndex) => {
                                        const inventory = inventories.find(inventory => inventory.listing == product && inventory.variant == product && inventory.location == location._id);
                                        return <Td py = '0px' key = {prodIndex}>
                                            <Input type = 'number' p = '0px' onChange = {(event) => onChangeInventory(event, location._id, product)} variant='ghost' value = {inventory?.quantity?.toString() ?? 0} />
                                        </Td>
                                    })}
                                </Tr>
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>

            <Flex bg = 'gray.400' w = '100%' p = '20px' gridGap={'10px'} direction={'column'}>
                {order.map((orderItem, index) => {
                    return <Text px = '20px' py = '10px' bg = 'white' key = {index}>{orderItem.listing} - {orderItem.quantity}</Text>
                })}
                <Button onClick={() => { setCurrentEditingOrder(order); onOpen(); }} mt = '10px' bg = 'green.200' _hover={{bg: 'green.400', color: 'white'}}>{order.length > 0 ? 'Update Order' : 'Create Order'}</Button>
            </Flex>

            <Flex bg = 'gray.400' w = '100%' p = '20px' gridGap={'20px'} direction = 'column'>
                <Flex p = '10px' bg = 'white' justifyContent = 'center' as = 'b'>Algorithm type 1 ( Priority )</Flex>
                    <Flex w = '100%' gridGap={'20px'} flexWrap = 'wrap'>
                    {locationAssignedItemsByAlgorith1.map((groupedItem, groupedItemIndex) => {
                        const location = locations.find(e => e._id == groupedItem.location)?.name ?? groupedItem.location
                        return <Flex key = {groupedItem.location ?? '' + groupedItemIndex} p = '20px' minW = '250px' gridGap = '10px' flexGrow = {1} bg = 'white' direction = 'column'>
                            <Text as = 'b' color = {location ? 'auto' : 'red'}>{location ?? 'Not Assigned'}</Text>
                            {groupedItem.items.map((item, index) => {
                                return <Text key = {item.listing + index}>{item.listing} - {item.quantity}</Text>
                            })}
                        </Flex>
                    })}
                </Flex>
            </Flex>

            <Flex bg = 'gray.400' w = '100%' p = '20px' gridGap={'20px'} direction = 'column'>
                <Flex p = '10px' bg = 'white' justifyContent = 'center' as = 'b'>Algorithm type 2 ( Priority & Optimized )</Flex>
                <Flex w = '100%' gridGap={'20px'} flexWrap = 'wrap'>     
                    {locationAssignedItemsByAlgorith2.map((groupedItem, groupedItemIndex) => {
                        const location = locations.find(e => e._id == groupedItem.location)?.name ?? groupedItem.location
                        return <Flex key = {groupedItem.location ?? '' + groupedItemIndex} p = '20px' minW = '250px' gridGap = '10px' flexGrow = {1} bg = 'white' direction = 'column'>
                            <Text as = 'b' color = {location ? 'auto' : 'red'}>{location ?? 'Not Assigned'}</Text>
                            {groupedItem.items.map((item, index) => {
                                return <Text key = {item.listing + index}>{item.listing} - {item.quantity}</Text>
                            })}
                        </Flex>
                    })}
                </Flex>
            </Flex>

            <Flex bg = 'gray.400' w = '100%' p = '20px' gridGap={'20px'} direction = 'column'>
                <Flex p = '10px' bg = 'white' justifyContent = 'center' as = 'b'>Algorithm type 3 ( Optimized )</Flex>
                <Flex w = '100%' gridGap={'20px'} flexWrap = 'wrap'>     
                    {locationAssignedItemsByAlgorith3.map((groupedItem, groupedItemIndex) => {
                        const location = locations.find(e => e._id == groupedItem.location)?.name ?? groupedItem.location
                        return <Flex key = {groupedItem.location ?? '' + groupedItemIndex} p = '20px' minW = '250px' gridGap = '10px' flexGrow = {1} bg = 'white' direction = 'column'>
                            <Text as = 'b' color = {location ? 'auto' : 'red'}>{location ?? 'Not Assigned'}</Text>
                            {groupedItem.items.map((item, index) => {
                                return <Text key = {item.listing + index}>{item.listing} - {item.quantity}</Text>
                            })}
                        </Flex>
                    })}
                </Flex>
            </Flex>
            
        </Flex>
    )
}

export default Home
