import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, ScrollView, TextInput, Button, Alert, } from 'react-native';
import { registerRootComponent } from 'expo';

function App() {
    const API = "http://5e67aeb01937020016fee07f.mockapi.io/api/subjects"
    const fetchSubjects = () => {

        return fetch(
            API,
            {}
        ).then((reponse) => reponse.json())
            .then((reponseJson) => setSubject(reponseJson))
            .catch((error) => console.log(error));
    }

    useEffect(() => { fetchSubjects() },
        []
    )

    const checkLogin = () => {
        if (nameLogin !== "" && yearOld > 18) {
            setShowModal(false)
        }
    };


    const putItem = () => {

        const subject = {
            thumbnail: thumbnail,
            name: name,
            category: category,
            total_chapters: total_chapters,
            is_full: is_full
        };

        fetch(
            `${API}/${id}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subject)
            }
        ).then((reponse) => {reponse.json() })
            .then(() => fetchSubjects())
            .catch(error => console.log('error', error))
        
    }




    const createItem = () => {

        const subject = {
            thumbnail: thumbnail,
            name: name,
            category: category,
            total_chapters: total_chapters,
            is_full: is_full
        };

        fetch(
            API,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subject)
            }
        ).then((reponse) => reponse.json())
            .then(() => fetchSubjects())
            .catch(error => console.log('error', error))


      

    }

    const handleDelete = (id) => {
        fetch(
            `${API}/${id}`,
            { method: 'DELETE' }
        ).then(() => fetchSubjects())

            .catch((error) => console.log(error))
    }

    const alertDelete = (identity, handleDelete) => {
        return Alert.alert(
            'Delete Subject',
            `Ban co muon xoa  khong?`,
            [
                {
                    text: 'Co',
                    onPress: () => { handleDelete(identity) }
                },
                {
                    text: 'Khong',
                    onPress: () => { }
                }
            ],
            { cancleable: false }
        )
    };

    const [id, setId] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [total_chapters, setTotal_chapters] = useState("");
    const [is_full, setIs_full] = useState("");

    const [nameLogin, setNameLogin] = useState("");
    const [yearOld, setYearOld] = useState();

    const [subject, setSubject] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [showModalDeltai, setShowModalDeltai] = useState(false);
    const [showModalEdit, setshowModalEdit] = useState(false);
    const [showModalCreat, setshowModalCreat] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.textNameLogin}>Chào: {nameLogin}</Text>
            <Button style={styles.buttona}
                title="Thêm truyện"
                onPress={() => setshowModalCreat(true)}
            />
            <FlatList style={styles.flatlist}
                data={subject}
                renderItem={({ item }) => <View>
                    <Image
                        style={{ width: 120, height: 120 }}
                        source={{ uri: item.thumbnail }}
                    />
                    <Text>Name: {item.name}</Text>
                    <Text>Thể loại: {item.category}</Text>
                    <Text>Số champter: {item.total_chapters}</Text>
                    <Text>Tình trạng: {item.is_full}</Text>
                    <Button
                        title="DETAIL"
                        onPress={() => {
                            setShowModalDeltai(true),
                                setThumbnail(item.thumbnail),
                                setName(item.name),
                                setCategory(item.category),
                                setTotal_chapters(item.total_chapters),
                                setIs_full(item.is_full)
                        }}
                    />
                    <Button
                        title="EDIT"
                        onPress={() => {
                            setshowModalEdit(true),
                            setId(item.id)
                                setThumbnail(item.thumbnail),
                                setName(item.name),
                                setCategory(item.category),
                                setTotal_chapters(item.total_chapters),
                                setIs_full(item.is_full)
                        }}

                    />
                    <Button
                        title="DELETE"

                        onPress={
                            () => alertDelete(item.id, handleDelete)
                        }
                    />
                </View>}
            />

            <Modal visible={showModal} >
                <ScrollView>
                    <View style={styles.modal}>
                        <Text style={styles.text} >Nhập thông tin</Text>
                        <Text style={styles.textModal} >Tên</Text>
                        <TextInput style={styles.input} onChangeText={(valueName) => setNameLogin(valueName)} />

                        <Text style={styles.textModal} >Tuổi</Text>
                        <TextInput style={styles.input} onChangeText={(yearOld) => setYearOld(yearOld)} />

                        <Button
                            title="Go"
                            onPress={() => checkLogin()}
                        />
                    </View>
                </ScrollView>

            </Modal>

            <Modal visible={showModalDeltai} >

                <ScrollView>

                    <View style={styles.row}>
                        <View>
                            <Image style={styles.image} source={{ uri: thumbnail }} />
                            <Text style={styles.styleNameText}>{`Tên truyện: ${name}`}</Text>
                            <Text style={styles.textStyle} >{`Thể loại truyện: ${category}`}</Text>
                            <Text style={styles.textStyle} >{`Số chương: ${total_chapters}`}</Text>

                            <Text>Tình trạng: {is_full}</Text>
                            <Button
                                title="Back"
                                onPress={() => setShowModalDeltai(false)}

                            />
                        </View>

                    </View>

                </ScrollView>

            </Modal>

            <Modal visible={showModalEdit} >

                <ScrollView>

                    <View style={styles.row}>
                        <View>
                            <Image style={styles.image} source={{ uri: thumbnail }} />
                            <TextInput onChangeText={text => setName(text)} style={styles.input}>{name}</TextInput>
                            <TextInput onChangeText={text => setCategory(text)} style={styles.input} >{category}</TextInput>
                            <TextInput onChangeText={text => setTotal_chapters(text)} style={styles.input} >${total_chapters}</TextInput>

                            <TextInput onChangeText={text => setIs_full(text)} style={styles.input}>{is_full}</TextInput>
                            <Button
                                title="OK"
                                onPress={() => {putItem(), 
                                    setshowModalEdit(false)}}

                            />
                            <Button
                                title="Back"
                                onPress={() => setshowModalEdit(false)}

                            />
                        </View>

                    </View>

                </ScrollView>

            </Modal>

            <Modal visible={showModalCreat} >

                <ScrollView>

                    <View style={styles.row}>
                        <View>
                            <TextInput onChangeText={text => setThumbnail(text)} style={styles.input}></TextInput>
                            <TextInput onChangeText={text => setName(text)} style={styles.input}></TextInput>
                            <TextInput onChangeText={text => setCategory(text)} style={styles.input} ></TextInput>
                            <TextInput onChangeText={text => setTotal_chapters(text)} style={styles.input} ></TextInput>
                            <TextInput onChangeText={text => setIs_full(text)} style={styles.input}></TextInput>
                            <Button
                                title="Dong y"

                                onPress={() => {
                                    createItem(),
                                        setshowModalCreat(false)

                                }}

                            />
                            <Button
                                title="Back"

                                onPress={() => setshowModalCreat(false)}

                            />
                        </View>

                    </View>

                </ScrollView>

            </Modal>

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {

        marginTop: 50,

    },
    row: {
        padding: 8,
        // flex: 1,
        marginTop: 50,
        alignItems: "center",
        justifyContent: 'center',


    },
    textNameLogin: {
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 20
    },
    textModal: {
        padding: 8,
        margin: 10,
    },
    buttona: {
        width: 200,
        height: 50
    },
    modal: {
        flex: 1,
    },
    flatlist: {

        marginTop: 16,
    },
    text: {
        fontSize: 30,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,

    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 250,
        borderRadius: 100,
        marginBottom: 20

    },
    styleNameText: {
        fontSize: 20,
        fontStyle: "italic",
        fontWeight: "bold",
        color: 'green'
    },
    textStyle: {
        lineHeight: 20

    }
});

export default registerRootComponent(App);