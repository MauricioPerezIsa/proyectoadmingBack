const Year = require("../models/year.model");
const Alumno = require("../models/alumnos.model");


const createAlumno = async (req, res) => {
    const {
        nameAlumno,
        lastnameAlumno,
        legajoAlumno
    } = req.body

    const alumnoCollection = await Alumno.find({ legajoAlumno })
    if (alumnoCollection.length) {
        return res.status(400).json({ message: `El alumno con legajo ${legajoAlumno} ya existe` });
    }

    const alumno = new Alumno({
        nameAlumno,
        lastnameAlumno,
        legajoAlumno
    })


    await alumno.save()
    const year = new Year({
        idAlumno: alumno._id,
        anio: 1
    })
    await year.save()

    console.log(alumno)
    console.log(year)

    res.status(201)
    res.json({ message: "Alumno registrado exitosamente" })
}

const findAllAlumno = async (req, res) => {
    const nameRegex = new RegExp(req.query.nameAlumno)
    const lastnameRegex = new RegExp(req.query.lastnameAlumno)
    const filters = {
        nameAlumno: {
            $regex: nameRegex,
        },
        lastnameAlumno: {
            $regex: lastnameRegex,
        }
    }
    const alumno = await Alumno.find(filters)

    res.json({ message: "Alumno encontrado", data: alumno })
}

const findByIdAlumno = async (req, res) => {
    const alumno = await Alumno.findById(req.params.id)

    if (alumno === null) {
        res.status(404)
        return res.json({ message: "Alumno admin not found" })
    }

    res.json({ message: "FIND ALUMNO BY ID" + alumno.nameAlumno })
}

const updateByIdAlumno = async (req, res) => {
    const alumno = await Alumno.findById(req.params.id)

    if (alumno === null) {
        res.status(404)
        return res.json({ message: "Alumno admin not found or already delete" })
    }

    await Alumno.findByIdAndUpdate(req.params.id, {
        nameAlumno: req.body.nameAlumno,
        lastnameAlumno: req.body.lastnameAlumno,
        legajoAlumno: req.body.legajoAlumno
    })

    res.json({ message: "Update Alumno" })
}

const deleteAlumno = async (req, res) => {
    const alumno = await Alumno.findById(req.params.id)

    if (alumno === null) {
        res.status(404)
        return res.json({ message: "Alumno not found or already delete" })
    }

    const filters = { _id: req.params.id }

    const deletedDocuments = await Alumno.deleteOne(filters)

    res.json({ message: "Delete Alumno: " + alumno.nameUser })
}

module.exports = {
    createAlumno,
    findByIdAlumno,
    updateByIdAlumno,
    deleteAlumno,
    findAllAlumno
}