CREATE TABLE IF NOT EXISTS `department`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30)
);
CREATE TABLE IF NOT EXISTS `role`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(30),
    `salary` DECIMAL,
    `department_id` INT REFERENCES `department`(`id`)
);
CREATE TABLE IF NOT EXISTS `employee`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(30),
    `last_name` VARCHAR(30),
    `role_id` INT REFERENCES `role`(`id`),
    `manager_id` INT DEFAULT NULL REFERENCES `employee`(`id`)
);