export default function oneTrim(values) {
    if (values.username !== undefined) {
        values.username = values.username.trim()
    }
    if (values.password !== undefined) {
        values.password = values.password.trim()
    }
    if (values.ak !== undefined) {
        values.ak = values.ak.trim()
    }
    if (values.schoolName !== undefined) {
        values.schoolName = values.schoolName.trim()
    }
    if (values.schoolId !== undefined) {
        values.schoolId = values.schoolId.trim()
    }

    return values;
}
